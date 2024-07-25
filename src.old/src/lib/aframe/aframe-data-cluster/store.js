import * as d3 from 'd3'
import PS from 'pubsub-js'
import afu from '../aframe-utils'
import cfg from '../config'
import consts from '../consts'

let state = {
	data: {},
	currentKey: '',
	currentData: {}
}

// let onDataChange = () => {
//   document.querySelectorAll(".data-chart").forEach(el => {
//     el.setAttribute("data-chart", "key", _state.key)
//   })
// }

const EVENTS = {
	DATA_STREAM: 'data stream'
}

let evt = EVENTS
//let NUMERICAL = "numerical"
//let CATEGORICAL = "categorical"

let guessFieldType = ({ key, data }, field) => {
	let fs = cfg.datasets[key].fields
	if (field in fs) return fs[field]
	// let n = d3.nest()
	//     .key(d => d[field])
	//     .entries(data.slice(0, 200))
	let s = new Set(data.slice(0, 500).map((d) => d[field]))
	if (s.size < 20) return consts.FIELD_TYPES.Categorical
	// numerical?
	if (data.slice(0, 50).every((d) => d === null || !isNaN(Number(d[field])))) {
		return consts.FIELD_TYPES.Numerical
	}
}

let processDataset = (data) => {
	data.fields = Object.keys(data.data[0])
	data.fields.pop('_index')
	data.fieldTypes = {}
	data.fields.forEach((f) => (data.fieldTypes[f] = guessFieldType(data, f)))
	afu.log(`Dataset ${data.key} has ${data.fields.length} fields`, data.fields)
	afu.log('FieldTypes:', data.fieldTypes)
	return data
}

export default {
	evt: EVENTS,
	state,
	setData({ data, key }) {
		let ds = (state.data[key] = processDataset({ data, key }))
		state.currentKey = key
		PS.publish(evt.DATA_STREAM, ds)
	},
	getData(key) {
		if (!key) key = state.currentKey
		return state.data[key]
	}
}
