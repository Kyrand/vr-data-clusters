/* global dat */
import consts from '@lib/aframe/consts'
import _ from 'lodash'
import { select } from 'd3-selection'

let sayHello = () => {
	console.log("Hi, I'm the datgui menu!")
}

export default function (el) {
	let rightHandControl = select('#right-hand-control').node()
	let leftHandControl = select('#left-hand-control').node()

	const { camera, renderer } = el.sceneEl
	const scene = el.sceneEl.object3D

	dat.GUIVR.enableMouse(camera, renderer)

	//  add an input object (any Object3D like ViveController or Camera)
	//  you can add multiple objects
	;[rightHandControl, leftHandControl].forEach((controllerEl) => {
		let guiInput = dat.GUIVR.addInputObject(controllerEl.object3D)
		;['trigger', 'trackpad', 'grip'].forEach((baseEvent) => {
			;['up', 'down'].forEach((e) => {
				controllerEl.addEventListener(baseEvent + e, () => {
					let gripEvent = baseEvent === 'grip'
					console.log((gripEvent ? 'gripped' : 'pressed') + ' ' + controllerEl + ' ' + e)
					let value = e === 'down'
					gripEvent ? guiInput.gripped(value) : guiInput.pressed(value)
				})
			})
		})
		scene.add(guiInput)
	})
}
