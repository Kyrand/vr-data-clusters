/* global AFRAME */
import Planets from './protoplanet'
import Boids from './boids'

// export default {
// register: (AFRAME) => {
console.log('Here.....!')
AFRAME.registerComponent('data-particles', {
	schema: {
		sim: { type: 'string', default: 'boids' },
		width: { type: 'int', default: 64 },
		height: { type: 'int', default: 64 },
		particleNum: { type: 'int', default: null },
		separation: { type: 'number', default: 9 },
		alignment: { type: 'number', default: 80 },
		cohesion: { type: 'number', default: 80 },
		freedom: { type: 'number', default: 0.75 },
		velMult: { type: 'number', default: 1.0 }
	},

	init() {
		console.log('Creating particle sim ' + this.data.sim)
		this.PARTICLES = this.data.width * this.data.width
		switch (this.data.sim) {
			case 'planets':
				this._sim = new Planets(this.el, { width: this.data.width })
				break

			case 'boids':
				this._sim = Boids(this.el, this.data, AFRAME)
				this._sim.valuesChanger(this.data)
				console.log('Boid data: ', this.data)
				break
		}
	},

	update(oldData) {
		if (oldData.width !== this.data.width || oldData.height !== this.data.height) {
			console.log('Making new Boids...')
			this._sim = Boids(this.el, this.data, AFRAME)
		}
		this._sim.valuesChanger(this.data)
		// console.log('Datacluster data: ', this.data)
	},

	// onDataChange(data) {
	// 	this._sim.valuesChanger(this.data)
	// 	console.log('Datacluster data: ', data)
	// },

	tick(time, delta) {
		this._sim.render()
	}
	// })
})
// }
