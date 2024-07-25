import DataCluster from './DataCluster'
import * as d3 from 'd3'
import consts from '../consts'

AFRAME.registerComponent('data-cluster', {
	schema: {
		animate: { type: 'boolean', default: false },
		showGrid: { type: 'boolean', default: false },
		dataset: { type: 'string', default: 'titanic' },
		colorField: { type: 'string' },
		xField: { type: 'string' },
		yField: { type: 'string' },
		zField: { type: 'string' },
		groupField: { type: 'string' },
		dimensions: { type: 'vec3', default: { x: 1, y: 1, z: 1 } },
		transitionTime: { type: 'int', default: 1000 }, // in ms
		cloudTransitionTime: { type: 'int', default: 3000 },
		cloudSpeed: { type: 'number', default: 0.2 },
		cloudType: { type: 'string', default: consts.CLOUD_TYPES.Cloud },
		jitterFactor: { type: 'number', default: 0.05 }
	},
	// COMPONENT METHODS
	init() {
		console.log('Creating data-cluster with dataset: ' + this.data.dataset)
		this._sim = DataCluster(this.el, this.data, AFRAME)
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

	onDataInit: function (data) {
		this._sim.init(data)
	}
})
