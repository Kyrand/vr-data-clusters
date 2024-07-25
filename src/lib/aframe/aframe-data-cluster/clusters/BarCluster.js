import * as d3 from 'd3'
import geoms from '../../CloudGeoms'
import { makeTextSprite, makeText } from '../../aframe-utils/labels'

export default (S) => {
	let AFData, data, axesScales, fieldData, fields
	const { el, fromArray, toArray, textLabels } = S
	let nestedData,
		groups,
		groupDetails = {}

	function groupByField(field) {
		nestedData = d3.groups(data, (d) => d[field])

		groups = nestedData.map((d) => d[0])
		nestedData.forEach((g) => (groupDetails[g[0]] = {}))
		nestedData = nestedData.map((d) => ({
			key: d[0],
			values: d[1].sort((a, b) => d3.ascending(a[AFData.colorField], b[AFData.colorField]))
		}))
	}

	function label() {
		// let groupLabels = d3.select(el).select('.labels .Bar')
		// groupLabels.selectAll('*').remove()

		const text = []
		groups.forEach((gKey) => {
			let gd = groupDetails[gKey]
			//makeText(groupLabels, gd.text, gd.labelPos)
			text.push(makeText({ position: gd.labelPos, text: gd.text }))
		})
		textLabels.set(text)
	}

	return {
		update() {
			;({ AFData, data, axesScales, fieldData, fields } = S)

			groupByField(AFData.groupField)
			let scale = d3
				.scaleBand()
				.domain(groups)
				.range([-AFData.dimensions.x / 2, AFData.dimensions.x / 2])
				.padding(0.1)

			let gap = AFData.sphereRadius * 2
			//let points = {}
			let idToPoints = {}
			nestedData.forEach((d) => {
				let count = d.values.length
				let width = scale.bandwidth()
				let facesX = Math.floor(width / gap)
				let facesY = Math.ceil(count / facesX)
				let startPt = new THREE.Vector3(scale(d.key) + gap / 2, axesScales.y.range()[0], 0)
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

			data.forEach((d, i) => {
				fromArray[i * 3 + 0] = toArray[i * 3 + 0]
				fromArray[i * 3 + 1] = toArray[i * 3 + 1]
				fromArray[i * 3 + 2] = toArray[i * 3 + 2]
				toArray[i * 3 + 0] = idToPoints[d._index].x
				toArray[i * 3 + 1] = idToPoints[d._index].y
				toArray[i * 3 + 2] = idToPoints[d._index].z
			})

			label()
		}
	}
}
