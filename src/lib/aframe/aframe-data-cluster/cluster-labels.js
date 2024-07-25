/* global THREE */
import * as d3 from 'd3'

import consts from '../consts'
import { makeTextSprite, makeText } from '../aframe-utils/labels'

export function createLabels(dataCluster) {
	switch (dataCluster.data.cloudType) {
		case consts.CLOUD_TYPES.Bar:
			//createBarLabels(dataCluster)
			break
		case consts.CLOUD_TYPES.XYZ:
			createXYZLabels(dataCluster)
			break
	}
}

export function createAxesLabels(dataCluster) {
	let labels = new THREE.Object3D()

	// groupDetails[key].labelPos
	let axesLabels = d3.select(dataCluster.el).append('a-entity').attr('class', 'axes-labels')

	let txt = makeText(dataCluster, 'Hello World', { x: 0, y: 0, z: 0 })

	labels.add(txt)
	labels.position.set(0, 0, 0)

	dataCluster.el.setObject3D('labels', labels)
}

export function createBarLabels(dataCluster) {
	let groupLabels = d3.select(dataCluster.el).select('.labels .Bar')

	groupLabels.selectAll('*').remove()

	dataCluster.groups.forEach((gKey) => {
		let gd = dataCluster.groupDetails[gKey]
		makeText(groupLabels, gd.text, gd.labelPos)
	})
}

export function createXYZLabels(dataCluster) {}
