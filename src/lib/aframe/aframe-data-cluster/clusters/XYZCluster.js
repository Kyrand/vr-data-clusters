import * as d3 from 'd3'
import consts from '../../consts'
import { createAxesGrids } from '../grid'
import { makeText } from '@lib/aframe/aframe-utils/labels'

export default (S) => {
	let AFData, data, axesScales, fieldData, fields
	const { el, fromArray, toArray, textLabels } = S

	function getAxisValue(axis, d, jit = false) {
		let scale = axesScales[axis]
		let v = scale ? scale(d[AFData[axis + 'Field']]) : 0
		// scale null etc...
		if (jit) v += (1 - Math.random()) * AFData.jitterFactor
		return v
	}

	function getAxisScale(axis) {
		return axesScales[axis]
	}

	const av = (range) => {
		return range[0] + (range[1] - range[0]) / 2
	}

	const getFieldData = (field, data) => {
		const f = fields[field]
		if (f) {
			const d = f[data]
			if (d) {
				return d
			}
		}
		return null
	}

	return {
		update() {
			;({ AFData, data, axesScales, fieldData, fields } = S)
			if (AFData.showGrid) {
				createAxesGrids({ getAxisScale, el })
			}

			const jit = { x: false, y: false, z: false }
			if (fieldData[AFData.xField].type === consts.FIELD_TYPES.Categorical) jit.x = true
			if (fieldData[AFData.yField].type === consts.FIELD_TYPES.Categorical) jit.y = true
			if (fieldData[AFData.zField].type === consts.FIELD_TYPES.Categorical) jit.z = true

			data.forEach((d, i) => {
				let x = getAxisValue('x', d, jit.x)
				let y = getAxisValue('y', d, jit.y)
				let z = getAxisValue('z', d, jit.z)

				if (x === undefined || y === undefined || z === undefined) {
					;[x, y, z] = [0, -10, 0]
				}

				fromArray[i * 3 + 0] = toArray[i * 3 + 0]
				fromArray[i * 3 + 1] = toArray[i * 3 + 1]
				fromArray[i * 3 + 2] = toArray[i * 3 + 2]
				toArray[i * 3 + 0] = x
				toArray[i * 3 + 1] = y
				toArray[i * 3 + 2] = z
			})
		}
	}
}
