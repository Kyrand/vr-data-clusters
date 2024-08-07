import * as d3 from 'd3'
import { renderHexJSON } from 'd3-hexjson'

export default (S) => {
	let AFData, data, axesScales, fieldData, fields
	const { el, fromArray, toArray, textLabels, hexData } = S

	let scaleV3 = (v, scale) => {
		return { x: v.x * scale, y: v.y * scale, z: v.z * scale }
	}

	return {
		update() {
			//const c = d3.select(el).select('.globe').components['globe']
			;({ AFData, data, axesScales, fieldData, fields } = S)
			const sd = AFData.markerWidth
			//const r = 0.611216345
			const R = 0.015 / Math.sin(Math.PI / 128)
			const dTheta = Math.PI / 64
			const rows = 10

			let theta = 0
			const _d3 = d3

			let gps = _d3.groups(data, (d) => d['elected_mp_party'])
			gps = gps.sort((a, b) => b[1].length - a[1].length)
			gps = gps.reduce((acc, curr) => [...acc, ...curr[1]], [])

			gps.forEach((d, i) => {
				const row = i % rows
				const r = R + row * sd
				theta = Math.floor(i / rows) * dTheta
				const x = -Math.cos(theta) * r
				const y = Math.sin(theta) * r
				const _i = d.__index
				fromArray[_i * 3 + 0] = toArray[_i * 3 + 0]
				fromArray[_i * 3 + 1] = toArray[_i * 3 + 1]
				fromArray[_i * 3 + 2] = toArray[_i * 3 + 2]
				toArray[_i * 3 + 0] = x
				toArray[_i * 3 + 1] = y
				toArray[_i * 3 + 2] = 0
			})
		}
	}
}
