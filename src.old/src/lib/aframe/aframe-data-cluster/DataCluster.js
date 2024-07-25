import './index.css'
import * as d3 from 'd3'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
import hexRgb from 'hex-rgb'
import store from './store'
import cfg from '../config'
import consts from '../consts'
import geoms from '../CloudGeoms'
import afu from '../aframe-utils'
import { createAxesGrids } from './grid'
import { createLabels } from './cluster-labels'

/* eslint import/no-webpack-loader-syntax: off */
import * as fragmentShader from '../shaders/timeVecFrag.frag'
//import * as vertexShader from '!raw-loader!glslify-loader!../shaders/timeVecVert.glsl'
import * as vertexShader from '../shaders/boxedVert.vert'

const vShader = `precision highp float;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		uniform float progress;

		attribute vec3 position;
		attribute vec2 uv;
		attribute vec3 toVector;
		attribute vec3 fromVector;
    attribute vec3 color;

		varying vec2 vUv;
		varying float vScale;
    varying vec3 vColor;

		void main() {

			//vec4 mvPosition = modelViewMatrix * vec4( toVector, 1.0 );
      vec3 mixV = mix(fromVector, toVector, progress);
			vec4 mvPosition = modelViewMatrix * vec4( mixV, 1.0 );
			//vec3 trTime = vec3(translate.x + time,translate.y + time,translate.z + time);
			//float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );
			//vScale = scale;
			//scale = scale * 10.0 + 10.0;
			mvPosition.xyz += position;
			vUv = uv;
      vColor = color;
			gl_Position = projectionMatrix * mvPosition;
		}`

const fShader = `
precision highp float;

varying vec3 vColor;
void main() {
  gl_FragColor = vec4( vColor, 1.0 );
  //gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
}
`

export default (el, data, AFRAME) => {
	const { THREE } = AFRAME

	let count = 40000
	let model = null
	let axesScales = { x: null, y: null, z: null }
	let fieldData = cfg.datasets[data.dataset].fields
	let idToPoints = {}
	let groupDetails = {}
	let clusterData, fields, geometry, fromArray, toArray, colorArray, material, progress, colorScale

	function init(data) {
		// SOME EVENT HANDLERS
		clusterData = data.data
		count = clusterData.length
		fields = data.fields
		console.log(`Adding ${count} particles...`)
		//gui(

		el.addEventListener('stateChange', (e) => {
			console.log('Changing data-cluster state to: ' + JSON.stringify(e.detail.stateChange))
			changeState(e.detail.stateChange)
		})
		// SHADER VARIABLES
		const sphereGeometry = new THREE.SphereGeometry(cfg.sphere.radius)
		geometry = new THREE.InstancedBufferGeometry()
		//geometry.copy(new THREE.SphereGeometry(cfg.sphere.radius))
		//geometry.instanceCount = count
		geometry.index = sphereGeometry.index
		geometry.attributes = sphereGeometry.attributes

		fromArray = new Float32Array(count * 3)
		toArray = new Float32Array(count * 3)
		colorArray = new Float32Array(count * 3)

		clusterCloud()
		updateColors()

		let a = new THREE.InstancedBufferAttribute(fromArray, 3, 1)
		//a.dynamic = true
		geometry.setAttribute('fromVector', a)
		a = new THREE.InstancedBufferAttribute(toArray, 3, 1)
		//a.dynamic = true
		geometry.setAttribute('toVector', a)
		a = new THREE.InstancedBufferAttribute(colorArray, 3, 1)
		//a.dynamic = true
		geometry.setAttribute('color', a)

		// material = new THREE.MeshBasicMaterial({
		// 	color: 'rgba(100,0,50,1)',
		// 	onBeforeCompile: (shader) => {
		// 		shader.vertexShader = `
		//       attribute vec3 instPos;
		//       ${shader.vertexShader}
		//     `.replace(
		// 			`#include <begin_vertex>`,
		// 			`#include <begin_vertex>
		//         transformed += instPos;
		//       `
		// 		)
		// 		//console.log(shader.vertexShader);
		// 	}
		// })

		material = new THREE.RawShaderMaterial({
			uniforms: {
				progress: { value: 0 }
			},
			vertexShader: vShader,
			fragmentShader: fShader,
			depthTest: true,
			depthWrite: true
			//side: THREE.DoubleSide,
			//forceSinglePass: true
		})

		let mesh = new THREE.Mesh(geometry, material)
		// mesh.scale.set(500, 500, 500)

		//mesh.updateMatrix()
		//mesh.frustrumCulled = false

		model = mesh
		el.setObject3D('mesh', mesh)
		el.emit('model-loaded', { format: 'mesh', model: mesh })
		// END SHADER VARIABLES
		onChange()
		//addParticles()
	}

	function addParticles() {
		const rand = (min, max) => min + Math.random() * (max - min)
		let particles
		const MAX = 100
		const setupScene = () => {
			particles = new THREE.Group()
			const geo = new THREE.SphereGeometry(0.1)
			const mat = new THREE.MeshLambertMaterial({ color: 'red' })
			for (let i = 0; i < MAX; i++) {
				const particle = new THREE.Mesh(geo, mat)
				particle.velocity = new THREE.Vector3(rand(-0.01, 0.01), 0.06, rand(-0.01, 0.01))
				particle.acceleration = new THREE.Vector3(0, -0.001, 0)
				particle.position.x = rand(-1, 1)
				particle.position.z = rand(-1, 1)
				particle.position.y = rand(-1, 1)
				particles.add(particle)
			}
			//particles.position.z = -4
			//scene.add(particles)
			el.setObject3D('particles', particles)
		}
		setupScene()
	}

	function onChange() {
		getAxesScales()
		arrangeCluster()
		updateColors()
		if (data.showGrid) {
			createAxesGrids({ getAxisScale, el })
			createLabels({ el })
		}
		logState()
	}

	function changeState(state) {
		if (state.colorField) {
			setColorField(state.colorField)
		}
	}

	function updateShaderVariables() {
		;['fromVector', 'toVector', 'color'].forEach((name) => {
			const a = geometry.getAttribute(name)
			a.needsUpdate = true
		})
	}

	function arrangeCluster() {
		//groupByBar()
		data.showGrid = false
		progress = 0
		switch (data.cloudType) {
			case consts.CLOUD_TYPES.XYZ:
				data.showGrid = true
				clusterXYZ()
				break
			case consts.CLOUD_TYPES.Cloud:
				clusterCloud()
				break
			default:
				clusterByGroup()
		}
		updateShaderVariables()
	}

	function groupByBar() {
		//...
	}

	// FIELD SETTERS
	function setCloudType(type) {
		data.cloudType = type
		onChange()
	}

	function setGroupField(field) {
		data.groupField = field
		onChange()
	}

	function setColorField(field) {
		data.colorField = field
		onChange()
	}

	function updateFields(xField, yField, zField, colorField, groupField) {
		if (xField) data.xField = xField
		if (yField) data.yField = yField
		if (zField) data.zField = zField
		if (groupField) data.groupField = groupField
		if (colorField) data.colorField = colorField

		onChange()
	}
	// END FIELD SETTERS

	function updateColors() {
		let cField = data.colorField

		let fieldTypes = [...new Set(clusterData.map((d) => d[cField]))]
		//console.log(fieldTypes)
		colorScale = d3.scaleOrdinal().domain(fieldTypes).range(d3ScaleChromatic[cfg.colorFieldScheme])

		clusterData.forEach((d, i) => {
			let c = colorScale(d[data.colorField])
			c = hexRgb(c)
			colorArray[i * 3 + 0] = c.red / 255.0
			colorArray[i * 3 + 1] = c.green / 255.0
			colorArray[i * 3 + 2] = c.blue / 255.0
		})
	}
	// END UPDATE STATE
	// GROUPING METHODS
	function clusterByGroup(field) {
		if (!field) field = data.groupField
		groupByField(field)
		switch (data.cloudType) {
			case consts.CLOUD_TYPES.Bar:
				groupBars()
				break
		}

		let that = this
		clusterData.forEach((d, i) => {
			fromArray[i * 3 + 0] = toArray[i * 3 + 0]
			fromArray[i * 3 + 1] = toArray[i * 3 + 1]
			fromArray[i * 3 + 2] = toArray[i * 3 + 2]
			toArray[i * 3 + 0] = idToPoints[d._index].x
			toArray[i * 3 + 1] = idToPoints[d._index].y
			toArray[i * 3 + 2] = idToPoints[d._index].z
		})
	}

	function groupBars() {
		let scale = (groupsScale = d3
			.scaleBand()
			.domain(groups)
			.range([-data.dimensions.x / 2, data.dimensions.x / 2])
			.padding(0.1))

		let gap = cfg.sphere.radius * 2
		//let points = {}
		nestedData.forEach((d) => {
			let count = d.values.length
			let width = scale.bandwidth()
			let facesX = Math.floor(width / gap)
			let facesY = Math.ceil(count / facesX)
			let startPt = new THREE.Vector3(scale(d.key), axesScales.y.range()[0], 0)
			let pts = geoms.getPointsInCuboid(facesX, facesY, 1, gap, startPt)
			groupDetails[d.key].labelPos = new THREE.Vector3(
				scale(d.key) + width / 2,
				geoms.getHighestPosition(pts) + gap * 2,
				0
			)
			groupDetails[d.key].text = d.key
			d.values.forEach((d, i) => {
				idToPoints[d._index] = pts[i]
			})
		})
	}

	function groupByField(field) {
		nestedData = d3
			.nest()
			.key((d) => d[field])
			.sortValues((a, b) => d3.ascending(a[data.colorField], b[data.colorField]))
			.entries(clusterData)

		groups = nestedData.map((d) => d.key)
		nestedData.forEach((g) => (groupDetails[g.key] = {}))
	}
	// AXES METHODS
	function getAxisScale(axis) {
		return axesScales[axis]
	}

	function getDatapointPos(d) {
		return afu.posToStr({
			x: axesScales.x ? axesScales.x(d[data.xField]) : 0,
			y: axesScales.y ? axesScales.y(d[data.yField]) : 0,
			z: axesScales.z ? axesScales.z(d[data.zField]) : 0
		})
	}

	function clusterXYZ() {
		// dataPoints
		//   .attr("animation", d => `property: position; dur: 1000; to: ${getDatapointPos(d)}`)
		// update from vector positions
		let jit = {}
		if (store.getData().fieldTypes[data.xField] === consts.FIELD_TYPES.Categorical) jit.x = true
		if (store.getData().fieldTypes[data.yField] === consts.FIELD_TYPES.Categorical) jit.y = true
		if (store.getData().fieldTypes[data.zField] === consts.FIELD_TYPES.Categorical) jit.z = true

		clusterData.forEach((d, i) => {
			fromArray[i * 3 + 0] = toArray[i * 3 + 0]
			fromArray[i * 3 + 1] = toArray[i * 3 + 1]
			fromArray[i * 3 + 2] = toArray[i * 3 + 2]
			toArray[i * 3 + 0] = getAxisValue('x', d, jit.x)
			toArray[i * 3 + 1] = getAxisValue('y', d, jit.y)
			toArray[i * 3 + 2] = getAxisValue('z', d, jit.z)
		})
	}

	function getRandomCloudPoint() {
		let d = data.dimensions
		return new THREE.Vector3(
			(Math.random() - 0.5) * d.x,
			(Math.random() - 0.5) * d.y,
			(Math.random() - 0.5) * d.z
		)
	}

	function clusterCloud() {
		clusterData.forEach((d, i) => {
			let p = getRandomCloudPoint()
			fromArray[i * 3 + 0] = toArray[i * 3 + 0]
			fromArray[i * 3 + 1] = toArray[i * 3 + 1]
			fromArray[i * 3 + 2] = toArray[i * 3 + 2]
			toArray[i * 3 + 0] = p.x
			toArray[i * 3 + 1] = p.y
			toArray[i * 3 + 2] = p.z
		})
	}

	function getAxisValue(axis, d, jit = false) {
		let scale = axesScales[axis]
		let v = scale ? scale(d[data[axis + 'Field']]) : 0
		if (jit) v += (1 - Math.random()) * data.jitterFactor
		return v
	}

	// FIELD SETTERS
	function logAxesInfo() {
		for (const [k, v] of Object.entries(axesScales)) {
			console.log('Axes: ' + k)
			console.log('Domain: ' + JSON.stringify(v.domain()))
			console.log('Range: ' + JSON.stringify(v.range()))
		}
	}

	function getAxesScales() {
		axesScales.x = getScaleByField(data.xField, [-data.dimensions.x / 2, data.dimensions.x / 2])
		axesScales.y = getScaleByField(data.yField, [-data.dimensions.y / 2, data.dimensions.y / 2])
		axesScales.z = getScaleByField(data.zField, [-data.dimensions.z / 2, data.dimensions.z / 2])
		logAxesInfo()
	}

	function getScaleByField(field, range) {
		if (!field) {
			return null
		}
		console.log('Setting axis field ' + field)
		let fieldTypes
		if (fieldData[field]) {
			switch (fieldData[field].type) {
				default:
					let extent = d3.extent(clusterData.map((d) => d[field]))
					let s = d3.scaleLinear().range(range).domain(extent)
					s.__type = 'linear'
					return s
			}
		} else {
			fieldTypes = [...new Set(clusterData.map((d) => d[field]))]
			let s = d3.scalePoint().range(range).domain(fieldTypes).padding(cfg.cluster.padding)
			s.__type = 'ordinal'
			return s
		}
	}

	function logState() {
		console.log(`xField: ${data.xField}, yField: ${data.yField}, zField: ${data.zField}`)
	}

	function render(delta) {
		if (model === null) return
		if (data.cloudType === consts.CLOUD_TYPES.Cloud) {
			progress += delta / data.cloudTransitionTime
			if (progress > 1.0) {
				progress = 0.0
				clusterCloud()
				updateShaderVariables()
			}
		} else {
			progress += delta / data.transitionTime
			if (progress > 1.0) progress = 1.0
		}

		model.material.uniforms.progress.value = progress
	}

	function valuesChanger(data) {}

	return { render, init, valuesChanger }
}
