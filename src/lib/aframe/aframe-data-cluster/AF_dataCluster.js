import DataCluster from './DataCluster'
import * as d3 from 'd3'
import consts from '@lib/aframe/consts'
import cfg from '@lib/aframe/config.js'
import { getDataset } from '@lib/aframe/aframe-data-cluster/datasetStore.js'

AFRAME.registerComponent('data-cluster', {
	schema: {
		animate: { type: 'boolean', default: false },
		showGrid: { type: 'boolean', default: true },
		key: { type: 'string', default: 'titanic' },
		colorField: { type: 'string' },
		xField: { type: 'string' },
		yField: { type: 'string' },
		zField: { type: 'string' },
		geoField: { type: 'string' },
		groupField: { type: 'string' },
		dimensions: { type: 'vec3', default: { x: 1, y: 1, z: 1 } },
		transitionTime: { type: 'int', default: 1000 }, // in ms
		cloudTransitionTime: { type: 'int', default: 5000 },
		cloudSpeed: { type: 'number', default: 0.2 },
		geoScale: { type: 'number', default: 0.005 },
		cloudType: { type: 'string', default: consts.CLOUD_TYPES.Cloud },
		jitterFactor: { type: 'number', default: 0.05 },
		sphereRadius: { type: 'number', default: cfg.sphere.radius },
		padding: { type: 'number', default: cfg.cluster.padding },
		colorFieldScheme: {
			type: 'string',
			default: cfg.colorFieldScheme,
			parse: JSON.parse,
			stringify: JSON.stringify
		},
		config: { type: 'string', default: '[]', parse: JSON.parse, stringify: JSON.stringify },
		data: { type: 'string', default: '[]', parse: JSON.parse, stringify: JSON.stringify },
		hexData: { type: 'string', default: '{}', parse: JSON.parse, stringify: JSON.stringify }
	},
	// COMPONENT METHODS
	init() {
		console.log('Creating data-cluster with dataset: ' + this.data.key)
		this._sim = DataCluster(this.el, this.data, AFRAME)
		console.log('Data: ', this.data.data)
		this._sim.init({ ...this.data.config, data: this.data.data, hexData: this.data.hexData })
	},

	update(oldData) {
		this.data.rightHandControl = d3.select('#right-hand-control').node()
		this.data.leftHandControl = d3.select('#left-hand-control').node()
		this._sim.valuesChanger(this.data)
	},

	tick: function (time, delta) {
		this._sim.render(delta)
		//...
	},

	onDatasetInit: function (dataset) {
		console.log('Initializing dataset: ', dataset)
		this._sim.init(dataset)
	}
})
