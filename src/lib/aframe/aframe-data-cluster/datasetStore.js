//import { getContext, hasContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import cfg from '../config'

const datasets = new Map()

export const addDataset = (_dataset, _name) => {
	const { key } = _dataset
	const name = _name ?? key
	if (!datasets.has(name)) {
		console.log(`Adding ${name} dataset`)
		datasets.set(name, writable(_dataset))
	} else {
		console.warn(`The dataset with key ${name} already exists!!`)
	}
	return datasets.get(name)
}

export const getDataset = (_name) => {
	const dataset = datasets.has(_name)
	if (!dataset) {
		console.warn(`No dataset with name ${_name}`)
		return
	}
	return datasets.get(_name)
}
