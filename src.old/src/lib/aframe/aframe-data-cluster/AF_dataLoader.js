/* global AFRAME */
import { json } from 'd3'

import afu from '../aframe-utils'
import store from './store'
import cfg from '../config'

AFRAME.registerComponent('data-loader', {
	schema: {
		dataset: { type: 'string' }
	},

	init() {
		console.log('Loading dataset: ' + this.data.dataset)
		json('assets/data/' + this.data.dataset + '.json').then((data) => {
			afu.log(data)
			// preliminary data processing
			//AFRAME.scenes[0].emit("setChartData", this.processData(data))
			this.fieldData = cfg.datasets[this.data.dataset].fields
			store.setData({
				key: this.data.dataset,
				data: this.processData(data)
			})
			// now set things rolling
			//this.initCluster()
			// add a little interaction
			//gui(this)
		})
	},

	processData: function (clusterData) {
		this.clusterData = clusterData
		this.fields = Object.keys(this.clusterData[0])
		this.count = clusterData.length

		this.clusterData.forEach((d, i) => {
			d._index = i
			this.fields.forEach((f) => {
				if (this.fieldData[f]) {
					// process by type...
				} else {
					if (d[f] !== undefined && d[f] !== null) d[f] = d[f].toString()
					else d[f] = null
				}
			})
		})
		return this.clusterData
	},

	update() {},

	tick(time, delta) {}
})
