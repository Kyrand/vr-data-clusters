/* global THREE, AFRAME */
import afu from '../../aframe-utils'

const D2R = Math.PI / 180
const indicatorRots = [90, 210, 330]

AFRAME.registerComponent('data-whip', {
	schema: {
		key: { type: 'string' },
		length: { type: 'number', default: 0.7 },
		radius: { type: 'number', default: 0.25 },
		rateFudgeFactor: { type: 'number', default: 0.005 },
		polarity: { type: 'number', default: -1.0 },
		strength: { type: 'number', default: 1.0 },
		scale: { type: 'number', default: 0.3 }
	},

	/** @this {{data: Object.<any, any>, _buttonDown: boolean, _pos: object, _dir: object, el: HTMLElement, _indicators: HTMLElement[]}} */
	init() {
		this._buttonDown = false
		this._pos = new THREE.Vector3()
		this._dir = new THREE.Vector3()

		console.log('Creating datawhip: ' + this.data.key)
		// let el = document.createElement('a-cylinder')
		// this._cylinder = this.el.appendChild(el)
		// this._cylinder.setAttribute('rotation', '90 0 0')

		// el = document.createElement('a-sphere')
		// this._sphere = this.el.appendChild(el)
		let r = this.data.radius
		let p = this.data.polarity
		let s = this.data.scale
		this._indicators = indicatorRots.map((rot) => {
			let el = document.createElement('a-cone')
			el.setAttribute('rotation', `0 0 ${rot + 90 + 90 * (1 - p)}`)
			el.setAttribute('scale', `${s} ${s} ${s}`)
			el.setAttribute(
				'position',
				`${(Math.cos(D2R * rot) * r) / 2} ${(Math.sin(rot * D2R) * r) / 2} -${r / 2}`
			)
			el.setAttribute('radius-bottom', `0.2`)
			el.setAttribute('radius-top', `0.0`)
			el.setAttribute('height', `${this.data.length}`)
			el.setAttribute('material', `color: red;`)
			return this.el.appendChild(el)
		})

		this.updateAttrs()

		this.el.addEventListener('trackpaddown', (evt) => {
			afu.log('Track-pad down!', evt)
		})

		this.el.addEventListener('thumbstickmoved', (evt) => {
			afu.log('Axis move!', evt)
			//if (afu.axisReset(evt.detail.axis)) return
			// Interested in up/down
			this._stickPos = evt.detail.y
			this.data.polarity = this._stickPos * this.data.strength
			//this.data.length += rate * this.data.rateFudgeFactor
			this.updateAttrs()
			console.log('Polarity: ', this._stickPos, this.data.polarity)
		})

		this.el.addEventListener('triggerdown', (evt) => {
			this._buttonDown = true
			//afu.log('button down', evt)
		})

		this.el.addEventListener('triggerup', (evt) => {
			this._buttonDown = false
			this.el.sceneEl.emit('datawhipoff')
			//afu.log('button up', evt)
		})
	},

	updateAttrs() {
		let thumbPos = this._stickPos
		if (thumbPos > 0.9) thumbPos = 1
		else if (thumbPos < -0.9) thumbPos = -1
		this._indicators.forEach((el, i) => {
			el.setAttribute('rotation', `0 0 ${indicatorRots[i] + 90 - 90 * (1 + thumbPos)}`)
		})
		// this._cylinder.setAttribute('position', `0 0 ${-this.data.length / 2}`)
		// this._cylinder.setAttribute('material', 'color: white')
		// //this._cylinder.setAttribute("scale", "0.05 0.05 0.05")
		// this._cylinder.setAttribute('height', this.data.length)
		// this._cylinder.setAttribute('radius', 0.02)
		// this._sphere.setAttribute('position', `0 0 ${-this.data.length}`)
		// this._sphere.setAttribute('material', 'color: red')
		// //this._sphere.setAttribute("scale", "0.05 0.05 0.05")
		// this._sphere.setAttribute('radius', 0.05)
	},

	update() {},

	tick(time, delta) {
		if (Math.abs(this._stickPos) > 0.01) {
			afu.log('Button is down!!')
			afu.getWorldPosAndDir(this.el.object3D, this._pos, this._dir)
			this.el.emit('datawhipon', {
				pos: this._pos,
				dir: this._dir,
				polarity: this.data.polarity
			})
		}
	}
})
