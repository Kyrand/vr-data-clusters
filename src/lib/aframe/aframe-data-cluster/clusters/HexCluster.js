import * as d3 from 'd3'
import { renderHexJSON } from 'd3-hexjson'

export default (S) => {
	let AFData, data, axesScales, fieldData, fields
	const { el, fromArray, toArray, textLabels, hexData } = S

	let scaleV3 = (v, scale) => {
		return { x: v.x * scale, y: v.y * scale, z: v.z * scale }
	}
	const hexmap = renderHexJSON(hexData, 1.2, 1.2)

	return {
		update() {
			//const c = d3.select(el).select('.globe').components['globe']
			;({ AFData, data, axesScales, fieldData, fields } = S)

			data.forEach((d, i) => {
				const key = d['const_id']
				const hex = hexmap.find((d) => d.key === key)

				fromArray[i * 3 + 0] = toArray[i * 3 + 0]
				fromArray[i * 3 + 1] = toArray[i * 3 + 1]
				fromArray[i * 3 + 2] = toArray[i * 3 + 2]
				toArray[i * 3 + 0] = hex.x - 0.25
				toArray[i * 3 + 1] = -hex.y + 0.5
				toArray[i * 3 + 2] = 0
			})
		}
	}
}
