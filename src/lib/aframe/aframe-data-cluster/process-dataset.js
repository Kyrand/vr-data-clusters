import * as d3 from 'd3'
import consts from '../consts'

export function getAxesScales2({ data, xField, yField, zField, fieldData, dimensions, padding }) {
	const axesScales = {}
	axesScales.x = getScaleByField(
		data,
		fieldData,
		xField,
		[-dimensions.x / 2, dimensions.x / 2],
		padding
	)
	axesScales.y = getScaleByField(
		data,
		fieldData,
		yField,
		[-dimensions.y / 2, dimensions.y / 2],
		padding
	)
	axesScales.z = getScaleByField(
		data,
		fieldData,
		zField,
		[-dimensions.z / 2, dimensions.z / 2],
		padding
	)
	return axesScales
}

export function getAxesScales(pms) {
	const { data, fieldData, dimensions, padding } = pms
	const axesScales = {}

	;['x', 'y', 'z'].forEach((axis) => {
		const field = pms[axis + 'Field']
		const range = [-dimensions[axis] / 2, dimensions[axis] / 2]
		const { domain, type } = fieldData[field]
		axesScales[axis] = { domain, range, padding, type }
	})
	return axesScales
}

function getScaleByField(data, fieldData, field, range, padding) {
	//const { data, AFData } = dataset
	if (!field) {
		return null
	}
	console.log('Setting axis field ' + field)
	let fieldTypes
	let s
	const { domain, type } = fieldData[field]
	switch (type) {
		case consts.FIELD_TYPES.Categorical:
			s = d3.scalePoint().range(range).domain(domain).padding(padding)
			s.__type = type
			return s
		default:
			s = d3.scaleLinear().range(range).domain(domain)
			s.__type = type
			return s
	}
}
