/* global dat, THREE */
import './index.css'

import afu from '../../aframe-utils'

/* eslint import/no-webpack-loader-syntax: off */
import * as particleFragmentShader from './shaders/planets/particles.frag'
import * as particleVertexShader from './shaders/planets/particles.vert'
import * as computeShaderPosition from './shaders/planets/pos.frag'
import * as computeShaderVelocity from './shaders/planets/vel.frag'

export default (el, opts) => {
	let WIDTH = opts.width || 128
	let PARTICLES = WIDTH * WIDTH

	let gpuCompute
	let velocityVariable
	let positionVariable
	let positionUniforms
	let velocityUniforms
	let particleUniforms
	let effectController
	let geometry,
		renderer = el.sceneEl.renderer,
		camera = el.sceneEl.camera
	let gpurenderer
	let api = {}
	let last = performance.now()

	init()

	function init() {
		effectController = {
			// Can be changed dynamically
			gravityConstant: 100.0,
			density: 0.45,

			// Must restart simulation
			radius: 300,
			height: 8,
			exponent: 0.4,
			maxMass: 15.0,
			velocity: 70,
			velocityExponent: 0.2,
			randVelocity: 0.001
		}

		initComputeRenderer()

		//stats = new Stats()
		//container.appendChild( stats.dom )

		//window.addEventListener( "resize", onWindowResize, false )

		//initGUI()

		initProtoplanets()

		dynamicValuesChanger()
	}

	function initComputeRenderer() {
		// let renderer = new THREE.WebGLRenderer()
		// renderer.setClearColor( 0x000000 )
		// renderer.setPixelRatio( window.devicePixelRatio )
		// renderer.setSize( window.innerWidth, window.innerHeight )

		gpuCompute = new afu.GPUComputationRenderer(WIDTH, WIDTH, renderer)

		var dtPosition = gpuCompute.createTexture()
		var dtVelocity = gpuCompute.createTexture()

		fillTextures(dtPosition, dtVelocity)

		velocityVariable = gpuCompute.addVariable('textureVelocity', computeShaderVelocity, dtVelocity)
		positionVariable = gpuCompute.addVariable('texturePosition', computeShaderPosition, dtPosition)

		gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable])
		gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable])

		positionUniforms = positionVariable.material.uniforms
		velocityUniforms = velocityVariable.material.uniforms

		velocityUniforms.gravityConstant = { value: 0.0 }
		velocityUniforms.density = { value: 0.0 }

		var error = gpuCompute.init()
		if (error !== null) {
			console.error(error)
		}
	}

	function initGUI() {
		let gui = dat.GUIVR()

		let folder1 = gui.addFolder('Dynamic parameters')
		dat.GUIVR.enableMouse(camera, renderer)

		folder1
			.add(effectController, 'gravityConstant', 0.0, 1000.0, 0.05)
			.onChange(dynamicValuesChanger)
		folder1.add(effectController, 'density', 0.0, 10.0, 0.001).onChange(dynamicValuesChanger)

		let folder2 = gui.addFolder('Static parameters - press restartSimulation')

		folder2.add(effectController, 'radius', 10.0, 1000.0, 1.0)
		folder2.add(effectController, 'height', 0.0, 50.0, 0.01)
		folder2.add(effectController, 'exponent', 0.0, 2.0, 0.001)
		folder2.add(effectController, 'maxMass', 1.0, 50.0, 0.1)
		folder2.add(effectController, 'velocity', 0.0, 150.0, 0.1)
		folder2.add(effectController, 'velocityExponent', 0.0, 1.0, 0.01)
		folder2.add(effectController, 'randVelocity', 0.0, 50.0, 0.1)

		let buttonRestart = {
			restartSimulation: function () {
				restartSimulation()
			}
		}
		folder2.add(buttonRestart, 'restartSimulation')

		folder1.open()
		folder2.open()
	}

	function restartSimulation() {
		var dtPosition = gpuCompute.createTexture()
		var dtVelocity = gpuCompute.createTexture()

		fillTextures(dtPosition, dtVelocity)

		gpuCompute.renderTexture(dtPosition, positionVariable.renderTargets[0])
		gpuCompute.renderTexture(dtPosition, positionVariable.renderTargets[1])
		gpuCompute.renderTexture(dtVelocity, velocityVariable.renderTargets[0])
		gpuCompute.renderTexture(dtVelocity, velocityVariable.renderTargets[1])
	}

	function initProtoplanets() {
		geometry = new THREE.BufferGeometry()

		var positions = new Float32Array(PARTICLES * 3)
		var p = 0
		for (var i = 0; i < PARTICLES; i++) {
			positions[p++] = (Math.random() * 2 - 1) * effectController.radius
			positions[p++] = 0 //( Math.random() * 2 - 1 ) * effectController.radius
			positions[p++] = (Math.random() * 2 - 1) * effectController.radius
		}

		var uvs = new Float32Array(PARTICLES * 2)
		p = 0
		for (var j = 0; j < WIDTH; j++) {
			for (i = 0; i < WIDTH; i++) {
				uvs[p++] = i / (WIDTH - 1)
				uvs[p++] = j / (WIDTH - 1)
			}
		}

		geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
		geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2))

		particleUniforms = {
			texturePosition: { value: null },
			textureVelocity: { value: null },
			cameraConstant: { value: getCameraConstant(camera) },
			density: { value: 0.0 }
		}

		// ShaderMaterial
		let partRad = 0.5 //0.0125

		let fragStr = `
      varying vec4 vColor;

      void main() {

        float f = length( gl_PointCoord - vec2( ${partRad}, ${partRad} ) );
        if ( f > ${partRad} ) {
          discard;
        }
        gl_FragColor = vColor;

      }
    `
		var material = new THREE.ShaderMaterial({
			uniforms: particleUniforms,
			// vertexShader:   document.getElementById( "particleVertexShader" ).textContent,
			// fragmentShader: document.getElementById( "particleFragmentShader" ).textContent
			vertexShader: particleVertexShader,
			fragmentShader: particleFragmentShader
			//fragmentShader: fragStr
		})
		material.extensions.drawBuffers = true

		var particles = new THREE.Points(geometry, material)
		particles.matrixAutoUpdate = false
		particles.updateMatrix()

		//scene.add( particles )
		el.setObject3D('particles', particles)
	}

	function fillTextures(texturePosition, textureVelocity) {
		var posArray = texturePosition.image.data
		var velArray = textureVelocity.image.data

		var radius = effectController.radius
		var height = effectController.height
		var exponent = effectController.exponent
		var maxMass = (effectController.maxMass * 1024) / PARTICLES
		var maxVel = effectController.velocity
		var velExponent = effectController.velocityExponent
		var randVel = effectController.randVelocity

		for (var k = 0, kl = posArray.length; k < kl; k += 4) {
			// Position
			var x, y, z, rr

			do {
				x = Math.random() * 2 - 1
				z = Math.random() * 2 - 1
				rr = x * x + z * z
			} while (rr > 1)

			rr = Math.sqrt(rr)

			var rExp = radius * Math.pow(rr, exponent)

			// Velocity
			var vel = maxVel * Math.pow(rr, velExponent)

			var vx = vel * z + (Math.random() * 2 - 1) * randVel
			var vy = (Math.random() * 2 - 1) * randVel * 0.05
			var vz = -vel * x + (Math.random() * 2 - 1) * randVel

			x *= rExp
			z *= rExp
			y = (Math.random() * 2 - 1) * height

			var mass = Math.random() * maxMass + 1

			// Fill in texture values
			posArray[k + 0] = x
			posArray[k + 1] = y
			posArray[k + 2] = z
			posArray[k + 3] = 1

			velArray[k + 0] = vx
			velArray[k + 1] = vy
			velArray[k + 2] = vz
			velArray[k + 3] = mass
		}
	}

	function dynamicValuesChanger() {
		velocityUniforms.gravityConstant.value = effectController.gravityConstant
		velocityUniforms.density.value = effectController.density
		particleUniforms.density.value = effectController.density
	}

	function getCameraConstant(camera) {
		let cc = window.innerHeight / (Math.tan(THREE.Math.DEG2RAD * 0.5 * camera.fov) / camera.zoom)
		console.log(cc)
		return cc
	}

	api.render = function () {
		var now = performance.now()
		var delta = (now - last) / 1000

		if (delta > 1) delta = 1 // safety cap on large deltas
		last = now

		gpuCompute.compute()

		particleUniforms.texturePosition.value =
			gpuCompute.getCurrentRenderTarget(positionVariable).texture
		particleUniforms.textureVelocity.value =
			gpuCompute.getCurrentRenderTarget(velocityVariable).texture

		//renderer.render( scene, camera )
	}

	return api
}
