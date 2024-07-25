import * as d3 from 'd3'
import { Vector3 } from 'three'
// import "aframe-extras"
// import "super-hands"

// import "./state-changer"
import SceneLoader from './SceneLoader'
import { GPUComputationRenderer } from './GPUComputationRenderer'
import datgui from './datgui'

const DEFAULT_DIR = new Vector3(0, 0, -1)

let api = {
	datgui,
	SceneLoader,
	GPUComputationRenderer,

	addHandController(objects, handed = 'right', grab = true) {
		let hc = d3
			.select('a-scene')
			.append('a-entity')
			.attr('id', handed + '-hand-control')
			.attr('class', 'hand-controls')
			.attr('hand-controls', handed)
			.attr('aabb-collider', `objects: ${objects};`)
			.attr('grab', grab)

		return hc
	},

	addTrackedController(objects, handed = 'right', grab = true) {
		let cIndex = handed === 'right' ? 0 : 1
		let tc = d3
			.select('a-scene a-entity.scene #cameraWrapper')
			.append('a-entity')
			.attr('id', handed + '-hand-control')
			.attr('class', 'hand-controls')
			// .attr("tracked-controls", `controller: ${cIndex}; idPrefix: OpenVR`)
			//.attr("hand-controls", `hand: ${handed}` )
			.attr('hand-controls', `${handed}`)
			// .attr("aabb-collider", `objects: ${objects};`)
			.attr('super-hands', true)
			.attr('sphere-collider', `objects: ${objects}`)
		// .attr("sphere-collider", `objects: .data-cluster-wrapper`)
		// .attr("grab", grab)

		return tc
	},

	getGeomString(geom) {
		switch (geom.type) {
			case 'box':
				return `primitive: box; height: ${geom.params.height}; width: ${geom.params.width}; depth: ${geom.params.depth}`
			case 'sphere':
				return `primitive: sphere; radius: ${geom.params.radius}`
		}
	},

	Vec3ToStr: (pos) => {
		let s = `${pos.x} ${pos.y} ${pos.z}`
		return s
	},

	strToVec3: (s) => {
		let p = s.replace(/ +/g, ' ').split(' ').map(Number)
		return new Vector3(p[0], p[1], p[2])
	},

	randomPos: (scale = 2) => {
		return api.Vec3ToStr({
			x: (Math.random() - 0.5) * scale,
			y: (Math.random() - 0.5) * scale,
			z: (Math.random() - 0.5) * scale
		})
	},

	randomizePosition: function () {
		d3.select(this).attr('animation', `property: position; dur: 1000; to: ${api.randomPos()}`)
	},

	log: (msg, obj) => {
		console.log(msg)
		if (obj) console.log(obj)
	},
	getWorldPosAndDir: (obj3D, pos, dir, localDir = false) => {
		if (!localDir) localDir = DEFAULT_DIR
		obj3D.getWorldPosition(pos)
		dir.copy(localDir).transformDirection(obj3D.matrixWorld).normalize()
	},

	axisReset(axis) {
		return axis[0] === 0 && axis[1] === 0
	}

	// addStateChanger(objects, state, callback, el="a-scene") {
	//   let sc = d3.select(el)
	//       .append("a-box")
	//       .attr("class", "state-changer")
	//       .attr("aabb-collider", `objects: ${objects}`)
	//       .attr("grab", grab)

	//   return sc
	// }
}

export default api
