/* global dat, THREE */
import './index.css'
import { BirdGeometry } from './boidGeometry'
import { select } from 'd3-selection'
import GUI from 'lil-gui'
//import * as THREE from 'three'

import afu from '../../aframe-utils/index.js'
// import { GPUComputationRenderer } from 'gpucomputationrender-three'

/* eslint import/no-webpack-loader-syntax: off */
import * as particleFragmentShader from './shaders/boids/boids.frag'
import * as particleVertexShader from './shaders/boids/boids.vert'
import * as computeShaderPosition from './shaders/boids/pos.frag'
import * as computeShaderVelocity from './shaders/boids/vel.frag'

export default (el, opts, AFRAME) => {
	const { THREE } = AFRAME
	let WIDTH = opts.width || 32
	let HEIGHT = opts.height || 32

	let BIRDS = opts.birdNum || WIDTH * HEIGHT
	console.log(`Boid texture width: ${WIDTH}, height: ${HEIGHT}, boid number: ${BIRDS}`)

	let geometry,
		renderer = el.sceneEl.renderer,
		camera = el.sceneEl.camera
	let mouseX = 0,
		mouseY = 0

	let windowHalfX = window.innerWidth / 2
	let windowHalfY = window.innerHeight / 2

	let BOUNDS = 800,
		BOUNDS_HALF = BOUNDS / 2

	let last = performance.now()

	let gpuCompute
	let velocityVariable
	let positionVariable
	let positionUniforms
	let velocityUniforms
	let birdUniforms
	let api = {}

	init()

	function init() {
		el.sceneEl.addEventListener('datawhipon', (evt) => {
			afu.log('Datawhip is on!!', evt)
			velocityUniforms.polarity.value = evt.detail.polarity
			velocityUniforms.P.value.copy(evt.detail.pos)
			velocityUniforms.Q.value.copy(evt.detail.pos).add(evt.detail.dir)
		})

		el.sceneEl.addEventListener('datawhipoff', (evt) => {
			velocityUniforms.polarity.value = 0
		})

		initComputeRenderer()

		// var gui = new dat.GUI()

		initBirds()
		//initGUI()
	}

	function initGUI() {
		var effectController = {
			separation: 9.0, //20.0,
			alignment: 80.0, //20.0,
			cohesion: 80.0, //20.0,
			freedom: 0.75,
			velMult: 1.0,
			sky: 'sunset',
			preset: 'default'
		}

		let effectPresets = {
			default: [9, 80, 80, 0.75],
			sober: [20, 20, 20, 0.75],
			wild: [4, 40, 40, 5],
			organized: [15, 60, 60, 1.2]
		}

		var valuesChanger = function () {
			velocityUniforms.separationDistance.value = effectController.separation
			velocityUniforms.alignmentDistance.value = effectController.alignment
			velocityUniforms.cohesionDistance.value = effectController.cohesion
			velocityUniforms.freedomFactor.value = effectController.freedom
			velocityUniforms.velMult.value = effectController.velMult
		}

		let setSky = (s) => {
			select('a-sky').node().setAttribute('src', `#sky_${s}`)
		}

		let setPreset = (p) => {
			let vals = effectPresets[p]
			effectController.separation = vals[0]
			effectController.alignment = vals[1]
			effectController.cohesion = vals[2]
			effectController.freedom = vals[3]
			valuesChanger()
		}

		setSky(effectController.sky)
		setPreset(effectController.preset)

		//let gui = dat.GUIVR.create('Boid Variables')
		let gui = new GUI({ width: 300 })
		gui.add(effectController, 'separation', 0.01, 100.0, 1.0).onChange(valuesChanger).listen()
		gui.add(effectController, 'alignment', 0.01, 100, 0.001).onChange(valuesChanger).listen()
		gui.add(effectController, 'cohesion', 0.01, 100, 0.025).onChange(valuesChanger).listen()
		gui.add(effectController, 'freedom', 0.0, 5.0, 0.01).onChange(valuesChanger).listen()
		gui.add(effectController, 'velMult', 0.1, 10.0, 0.01).onChange(valuesChanger).listen()

		let skyOptions = [
			'sunset',
			'italy',
			'smog',
			'urriellu',
			'ashFalls',
			'marbleCanyon',
			'houses',
			'morioka',
			'yoplivia'
		]
		gui.add(effectController, 'sky', skyOptions).listen().onChange(setSky)

		gui.add(effectController, 'preset', Object.keys(effectPresets).sort()).onChange(setPreset)
		gui.domElement.id = 'boids-gui'
		// gui.domElement.style.visibility = 'hidden'
		// const group = new InteractiveGroup(renderer, camera, AFRAME)
		// el.sceneEl.object3D.add(group)

		// const mesh = new HTMLMesh(gui.domElement)
		// mesh.position.x = -0.75
		// mesh.position.y = 1.5
		// mesh.position.z = -0.5
		// mesh.rotation.y = Math.PI / 2
		// mesh.scale.setScalar(2)
		// group.add(mesh)
		//gui.close()
		console.log('Creating GUI')
		//gui.position.z = -1
		//gui.rotation.x = -45
		//gui.position.set(0, 0.5, -1)
		//gui.rotation.x = 45
		//el.sceneEl.setObject3D('datgui', gui)
	}

	function initComputeRenderer() {
		gpuCompute = new afu.GPUComputationRenderer(WIDTH, HEIGHT, renderer)

		if (renderer.capabilities.isWebGL2 === false) {
			gpuCompute.setDataType(THREE.HalfFloatType)
		}

		var dtPosition = gpuCompute.createTexture()
		var dtVelocity = gpuCompute.createTexture()
		fillPositionTexture(dtPosition)
		fillVelocityTexture(dtVelocity)

		// velocityVariable = gpuCompute.addVariable( "textureVelocity", document.getElementById( "fragmentShaderVelocity" ).textContent, dtVelocity )
		// positionVariable = gpuCompute.addVariable( "texturePosition", document.getElementById( "fragmentShaderPosition" ).textContent, dtPosition )
		velocityVariable = gpuCompute.addVariable(
			'textureVelocity',
			computeShaderVelocity.default,
			dtVelocity
		)
		positionVariable = gpuCompute.addVariable(
			'texturePosition',
			computeShaderPosition.default,
			dtPosition
		)

		gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable])
		gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable])

		positionUniforms = positionVariable.material.uniforms
		velocityUniforms = velocityVariable.material.uniforms

		positionUniforms.time = { value: 0.0 }
		positionUniforms.delta = { value: 0.0 }
		velocityUniforms.time = { value: 1.0 }
		velocityUniforms.delta = { value: 0.0 }
		velocityUniforms.testing = { value: 1.0 }
		velocityUniforms.separationDistance = { value: 1.0 }
		velocityUniforms.alignmentDistance = { value: 1.0 }
		velocityUniforms.cohesionDistance = { value: 1.0 }
		velocityUniforms.freedomFactor = { value: 1.0 }
		velocityUniforms.predator = { value: new THREE.Vector3() }
		velocityUniforms.P = { value: new THREE.Vector3() }
		velocityUniforms.Q = { value: new THREE.Vector3() }
		velocityUniforms.polarity = { value: 0.0 }
		velocityUniforms.velMult = { value: 0.0 }
		velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2)

		velocityVariable.wrapS = THREE.RepeatWrapping
		velocityVariable.wrapT = THREE.RepeatWrapping
		positionVariable.wrapS = THREE.RepeatWrapping
		positionVariable.wrapT = THREE.RepeatWrapping

		var error = gpuCompute.init()
		if (error !== null) {
			console.error(error)
		}
	}

	function initBirds() {
		var geometry = BirdGeometry(BIRDS, WIDTH)

		// For Vertex and Fragment
		birdUniforms = {
			color: { value: new THREE.Color(0xff2200) },
			texturePosition: { value: null },
			textureVelocity: { value: null },
			time: { value: 1.0 },
			delta: { value: 0.0 }
		}

		// ShaderMaterial
		var material = new THREE.ShaderMaterial({
			uniforms: birdUniforms,
			// vertexShader:   document.getElementById("birdVS").textContent,
			// fragmentShader: document.getElementById("birdFS").textContent,
			vertexShader: particleVertexShader.default,
			fragmentShader: particleFragmentShader.default,
			side: THREE.DoubleSide
		})
		material.extensions.drawBuffers = true

		let birdMesh = new THREE.Mesh(geometry, material)
		birdMesh.rotation.y = Math.PI / 2
		birdMesh.matrixAutoUpdate = false
		birdMesh.updateMatrix()
		birdMesh.frustrumCulled = false

		//el.sceneEl.setObject3D("birds", birdMesh)
		el.sceneEl.setObject3D('birds', birdMesh)
		//document.querySelector("[camera]").setObject3D("birds", birdMesh)
	}

	function fillPositionTexture(texture) {
		var theArray = texture.image.data

		for (var k = 0, kl = theArray.length; k < kl; k += 4) {
			var x = Math.random() * BOUNDS - BOUNDS_HALF
			var y = Math.random() * BOUNDS - BOUNDS_HALF
			var z = Math.random() * BOUNDS - BOUNDS_HALF

			theArray[k + 0] = x
			theArray[k + 1] = y
			theArray[k + 2] = z
			theArray[k + 3] = 1
		}
	}

	function fillVelocityTexture(texture) {
		var theArray = texture.image.data

		for (var k = 0, kl = theArray.length; k < kl; k += 4) {
			var x = Math.random() - 0.5
			var y = Math.random() - 0.5
			var z = Math.random() - 0.5

			theArray[k + 0] = x * 10
			theArray[k + 1] = y * 10
			theArray[k + 2] = z * 10
			theArray[k + 3] = 1
		}
	}

	api.render = function () {
		var now = performance.now()
		var delta = (now - last) / 1000

		if (delta > 1) delta = 1 // safety cap on large deltas
		last = now

		positionUniforms.time.value = now
		positionUniforms.delta.value = delta
		velocityUniforms.time.value = now
		velocityUniforms.delta.value = delta
		birdUniforms.time.value = now
		birdUniforms.delta.value = delta

		if (!renderer.xr.enabled) {
			velocityUniforms.predator.value.set(
				(0.5 * mouseX) / windowHalfX,
				(-0.5 * mouseY) / windowHalfY,
				0
			)
			mouseX = 10000
			mouseY = 10000
		} else {
			//velocityUniforms.polarity.value = 0.0
		}

		gpuCompute.compute()

		birdUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture
		birdUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture

		//renderer.render( scene, camera )
	}

	api.valuesChanger = function (data) {
		velocityUniforms.separationDistance.value = data.separation
		velocityUniforms.alignmentDistance.value = data.alignment
		velocityUniforms.cohesionDistance.value = data.cohesion
		velocityUniforms.freedomFactor.value = data.freedom
		velocityUniforms.velMult.value = data.velMult
	}

	document.addEventListener('mousemove', onDocumentMouseMove, false)
	document.addEventListener('touchstart', onDocumentTouchStart, false)
	document.addEventListener('touchmove', onDocumentTouchMove, false)

	window.addEventListener('resize', onWindowResize, false)
	function onWindowResize() {
		windowHalfX = window.innerWidth / 2
		windowHalfY = window.innerHeight / 2

		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()

		renderer.setSize(window.innerWidth, window.innerHeight)
	}

	function onDocumentMouseMove(event) {
		if (renderer.xr.enabled) return

		mouseX = event.clientX - windowHalfX
		mouseY = event.clientY - windowHalfY
	}

	function onDocumentTouchStart(event) {
		if (renderer.xr.enabled) return

		if (event.touches.length === 1) {
			event.preventDefault()

			mouseX = event.touches[0].pageX - windowHalfX
			mouseY = event.touches[0].pageY - windowHalfY
		}
	}

	function onDocumentTouchMove(event) {
		if (renderer.xr.enabled) return

		if (event.touches.length === 1) {
			event.preventDefault()

			mouseX = event.touches[0].pageX - windowHalfX
			mouseY = event.touches[0].pageY - windowHalfY
		}
	}

	return api
}
