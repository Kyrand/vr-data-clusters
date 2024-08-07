import './index.css'
import { getColorMapper } from '@lib/aframe/aframe-data-cluster/utils'
//import store from './store'
//import cfg from '../config'
import consts from '../consts'
import afu from '../aframe-utils'
import { createAxesGrids } from './grid'
import { createLabels } from './cluster-labels'
import { getAxesScales2 } from './process-dataset'
import BarCluster from './clusters/BarCluster'
import CloudCluster from './clusters/CloudCluster'
import XYZCluster from './clusters/XYZCluster'
import GlobeCluster from './clusters/GlobeCluster'
import HexCluster from './clusters/HexCluster'
//import BarCluster from './clusters/BarCluster'

/* eslint import/no-webpack-loader-syntax: off */
import * as fragmentShader from '../shaders/timeVecFrag.frag'
//import * as vertexShader from '!raw-loader!glslify-loader!../shaders/timeVecVert.glsl'
import * as vertexShader from '../shaders/boxedVert.vert'
import RadialCluster from './clusters/RadialCluster'

const vShader = `precision highp float;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		uniform float progress;
		uniform float scale;

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
			mvPosition.xyz += position * scale;
			vUv = uv;
			vColor = color;
			gl_Position = projectionMatrix * mvPosition;
		}`

const fShader = `
precision highp float;

uniform sampler2D map;

varying vec3 vColor;
varying vec2 vUv;

void main() {
  vec4 diffuseColor = texture2D( map, vUv );
	gl_FragColor = vec4( vColor * diffuseColor.xyz, diffuseColor.w );
	//gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
}
`

export default (el, AFData, AFRAME) => {
	const { THREE } = AFRAME

	const S = {}
	S.AFData = AFData
	S.el = el
	S.textLabels = el._textLabels
	let count = 40000
	let model = null
	let particles = null
	//let fieldData = cfg.datasets[AFData.key].fields
	let geometry,
		material,
		progress,
		clusters = {},
		cluster
	// interactive picking
	let raycaster = new THREE.Raycaster()
	let pointer = new THREE.Vector2()
	let intersects, INTERSECTED
	let camera = el.sceneEl.camera

	el.sceneEl.addEventListener('resize', onWindowResize)
	document.addEventListener('pointermove', onPointerMove)

	function onPointerMove(event) {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	}

	function onWindowResize() {
		// camera.aspect = window.innerWidth / window.innerHeight
		// camera.updateProjectionMatrix()
		// renderer.setSize(window.innerWidth, window.innerHeight)
	}

	function init(_dataset) {
		S.dataset = _dataset
		// SOME EVENT HANDLERS
		//;({ data, fieldData } = dataset)

		S.data = _dataset.data
		S.hexData = _dataset.hexData
		S.fieldData = _dataset.fieldData
		S.fields = _dataset.fields
		count = S.data.length
		//fields = dataset.fields
		console.log(`Adding ${count} particles...`)
		//gui(

		el.addEventListener('stateChange', (e) => {
			console.log('Changing data-cluster state to: ' + JSON.stringify(e.detail.stateChange))
			changeState(e.detail.stateChange)
		})
		// SHADER VARIABLES
		//const sphereGeometry = new THREE.SphereGeometry(cfg.sphere.radius)
		const sphereGeometry = new THREE.CircleGeometry(AFData.markerWidth / 2)
		geometry = new THREE.InstancedBufferGeometry()
		//geometry.copy(new THREE.SphereGeometry(cfg.sphere.radius))
		//geometry.instanceCount = count
		geometry.index = sphereGeometry.index
		geometry.attributes = sphereGeometry.attributes

		S.fromArray = new Float32Array(count * 3)
		S.toArray = new Float32Array(count * 3)
		S.colorArray = new Float32Array(count * 3)

		let a = new THREE.InstancedBufferAttribute(S.fromArray, 3, 1)
		//a.dynamic = true
		geometry.setAttribute('fromVector', a)
		a = new THREE.InstancedBufferAttribute(S.toArray, 3, 1)
		//a.dynamic = true
		geometry.setAttribute('toVector', a)
		a = new THREE.InstancedBufferAttribute(S.colorArray, 3, 1)
		//a.dynamic = true
		geometry.setAttribute('color', a)

		material = new THREE.RawShaderMaterial({
			uniforms: {
				progress: { value: 0 },
				scale: { value: 1 },
				map: { value: new THREE.TextureLoader().load('/assets/textures/sprites/circle.png') }
			},
			vertexShader: vShader,
			fragmentShader: fShader,
			depthTest: true,
			depthWrite: true
			//side: THREE.DoubleSide,
			//forceSinglePass: true
		})

		let mesh = new THREE.Mesh(geometry, material)

		S.setMarkerScale = (scale) => {
			if (scale) {
				mesh.material.uniforms.scale.value = scale
				//mesh.scale.set(scale, scale, scale)
			} else {
				//mesh.scale(AFData.sphereRadius, AFData.sphereRadius, AFData.sphereRadius)
			}
		}

		particles = model = mesh
		el.setObject3D('mesh', mesh)
		el.emit('model-loaded', { format: 'mesh', model: mesh })
		// END SHADER VARIABLES
		const _clusters = {
			Bar: BarCluster,
			Cloud: CloudCluster,
			XYZ: XYZCluster,
			Globe: GlobeCluster,
			HexMap: HexCluster,
			RadialCluster: RadialCluster
		}
		for (const [k, v] of Object.entries(_clusters)) {
			try {
				const _cluster = v(S)
				clusters[k] = _cluster
			} catch {
				console.log(`Error scaffolding cluster ${k}`)
			}
		}
		cluster = clusters['Cloud']

		//mesh.scale.set(0.1, 0.1, 0.1)
		//S.setSphereScale(0.5)

		onChange()
	}

	function onChange() {
		S.setMarkerScale(1)
		S.axesScales = getAxesScales2({ ...S.AFData, data: S.data, fieldData: S.fieldData })
		S.textLabels.set([])
		arrangeCluster()
		updateColors()
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
		progress = 0
		el.removeObject3D('grid')
		cluster = clusters[S.AFData.cloudType]
		cluster.update()
		updateShaderVariables()
	}

	function groupByBar() {
		//...
	}

	// FIELD SETTERS
	function setCloudType(type) {
		AFData.cloudType = type
		onChange()
	}

	function setGroupField(field) {
		AFData.groupField = field
		onChange()
	}

	function setColorField(field) {
		AFData.colorField = field
		onChange()
	}

	function updateFields(xField, yField, zField, colorField, groupField) {
		if (xField) AFData.xField = xField
		if (yField) AFData.yField = yField
		if (zField) AFData.zField = zField
		if (groupField) AFData.groupField = groupField
		if (colorField) AFData.colorField = colorField

		onChange()
	}

	function updateColors() {
		const { colorFieldScheme, colorField } = AFData
		const colorMapper = getColorMapper(colorFieldScheme, colorField, S.fieldData[colorField].domain)

		S.data.forEach((d, i) => {
			const c = colorMapper(d).col
			d.__index = i
			S.colorArray[i * 3 + 0] = c.red / 255.0
			S.colorArray[i * 3 + 1] = c.green / 255.0
			S.colorArray[i * 3 + 2] = c.blue / 255.0
		})
	}
	// AXES METHODS
	function getAxisScale(axis) {
		return S.axesScales[axis]
	}

	function getDatapointPos(d) {
		return afu.posToStr({
			x: S.axesScales.x ? S.axesScales.x(d[AFData.xField]) : 0,
			y: S.axesScales.y ? S.axesScales.y(d[AFData.yField]) : 0,
			z: S.axesScales.z ? S.axesScales.z(d[AFData.zField]) : 0
		})
	}

	// FIELD SETTERS
	function logAxesInfo() {
		for (const [k, v] of Object.entries(axesScales)) {
			console.log('Axes: ' + k)
			console.log('Domain: ' + JSON.stringify(v.domain()))
			console.log('Range: ' + JSON.stringify(v.range()))
		}
	}

	function logState() {
		console.log(`xField: ${AFData.xField}, yField: ${AFData.yField}, zField: ${AFData.zField}`)
	}

	function render(delta) {
		if (model === null) return
		if (S.AFData.cloudType === consts.CLOUD_TYPES.Cloud) {
			progress += delta / S.AFData.cloudTransitionTime
			if (progress > 1.0) {
				progress = 0.0
				//clusterCloud()
				cluster.update()
				updateShaderVariables()
			}
		} else {
			progress += delta / S.AFData.transitionTime
			if (progress > 1.0) progress = 1.0
		}

		model.material.uniforms.progress.value = progress
		getIntersections()
	}

	function getIntersections() {
		const geometry = particles.geometry
		const attributes = geometry.attributes

		raycaster.setFromCamera(pointer, camera)

		intersects = raycaster.intersectObject(particles)

		if (intersects.length > 0) {
			if (INTERSECTED != intersects[0].index) {
				attributes.color.array[INTERSECTED] = '#f00'

				INTERSECTED = intersects[0].index

				attributes.color.array[INTERSECTED] = '#f00'
				attributes.color.needsUpdate = true
			}
		} else if (INTERSECTED !== null) {
			attributes.color.array[INTERSECTED] = '#f00'
			attributes.color.needsUpdate = true
			INTERSECTED = null
		}
	}

	function valuesChanger(_data) {
		S.AFData = _data
		onChange()
	}

	return { render, init, valuesChanger }
}
