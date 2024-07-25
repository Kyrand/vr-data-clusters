/* global AFRAME, d3 */
import React, { Component } from 'react'
// import "./index.css"

import { json } from 'd3-request'
// import * as d3 from "d3"
import 'aframe-animation-component'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
import _ from 'underscore'

import cfg from '../config'
import geoms from '../CloudGeoms'
import afu from '../aframe-utils'

let posToStr = (pos) => {
	let s = `${pos.x} ${pos.y} ${pos.z}`
	return s
}

let randomPos = (scale = 2) => {
	return posToStr({
		x: (Math.random() - 0.5) * scale,
		y: (Math.random() - 0.5) * scale,
		z: (Math.random() - 0.5) * scale
	})
}

let randomizePosition = function () {
	d3.select(this).attr('animation', `property: position; dur: 1000; to: ${randomPos()}`)
}

// let App = () => {
// let api = {}
let clusters
let data

AFRAME.registerComponent('data-cluster', {
	schema: {
		animate: { type: 'boolean', default: false },
		dataset: { type: 'string', default: 'titanic' },
		colorField: { type: 'string' },
		xField: { type: 'string' },
		yField: { type: 'string' },
		zField: { type: 'string' }
	},

	init: function () {
		// AFRAME.registerState({
		//   initialState: {
		//     clusters: clusters
		//   }
		// })
		this.axesScales = { x: null, y: null, z: null }
		this.fieldData = cfg.datasets[this.data.dataset].fields
		json('data/' + this.data.dataset + '.json', (error, data) => {
			if (error) throw error
			this.clusterData = data
			console.log(data)
			// preliminary data processing
			// this.setColorField(this.data.colorField)
			this.processData()
			this.initCluster(data)
		})
	},

	processData: function () {
		this.fields = Object.keys(this.clusterData[0])

		this.clusterData.forEach((d) => {
			this.fields.forEach((f) => {
				if (this.fieldData[f]) {
					// process by type...
				} else {
					if (d[f] !== undefined && d[f] !== null) d[f] = d[f].toString()
					else d[f] = null
				}
			})
		})
	},

	initCluster: function (clusterData) {
		data = clusterData

		clusters = d3.select(this.el)

		let clusterWidth = cfg.clusterPadding * 2 + cfg.clusterRange[1] - cfg.clusterRange[0]
		clusters
			.attr('geometry', {
				type: 'box',
				params: { height: clusterWidth, width: clusterWidth, depth: clusterWidth }
			})
			.attr(
				'material',
				`side: double; color: #00ff00; opacity: ${cfg.clusterMaterialOpacity}; transparent: true`
			)
		// .on("hit", (e) => {
		//   console.log("Data cluster hit: ")
		// })
		// SOME EVENT HANDLERS
		this.el.addEventListener('stateChange', (e) => {
			console.log('Changing data-cluster state to: ' + JSON.stringify(e.detail.stateChange))
			this.changeState(e.detail.stateChange)
		})

		this.dataPoints = clusters
			.selectAll('a-entity')
			.data(data.slice(0, cfg.maxNumPoints))
			.enter()
			.append('a-entity')
			.attr('class', 'cube')
			.attr('mixin', 'cube')
			.attr('geometry', afu.getGeomString({ type: 'sphere', params: cfg.sphere }))
			.on('hitstart', (d) => {
				console.log(d)
			})

		// d3.selectAll(".hand-controls")
		//   .attr("aabb-collider", "objects: .cube;")

		this.setColorField(this.data.colorField)
		this.getAxesScales()

		this.arrangeCluster()

		if (this.data.animate) {
			this.animate()
		}
		//.attr("position", )
	},

	changeState: function (state) {
		if (state.colorField) {
			this.setColorField(state.colorField)
		}
	},

	arrangeCluster: function () {
		//this.groupByBar()
		this.clusterXYZ()
	},

	groupByBar: function () {
		//...
	},

	getDatapointPos: function (d) {
		return posToStr({
			x: this.axesScales.x ? this.axesScales.x(d[this.data.xField]) : 0,
			y: this.axesScales.y ? this.axesScales.y(d[this.data.yField]) : 0,
			z: this.axesScales.z ? this.axesScales.z(d[this.data.zField]) : 0
		})
	},

	clusterXYZ: function () {
		this.dataPoints.attr(
			'animation',
			(d) => `property: position; dur: 1000; to: ${this.getDatapointPos(d)}`
		)
	},

	animate: function () {
		let t = d3.interval(() => {
			clusters.selectAll('a-entity').each(randomizePosition)
			//t.stop()
		}, cfg.animationTime)
	},

	setColorField: function (cField) {
		this.data.colorField = cField

		let fieldTypes = [...new Set(this.clusterData.map((d) => d[cField]))]
		//console.log(fieldTypes)
		this.colorScale = d3
			.scaleOrdinal()
			.domain(fieldTypes)
			.range(d3ScaleChromatic[cfg.colorFieldScheme])

		let that = this
		this.dataPoints.attr('material', (d) => {
			let colorStr = 'color: ' + that.colorScale(d[that.data.colorField])
			// console.log(colorStr)
			return colorStr
		})
	},

	logAxesInfo: function () {
		_.forEach(this.axesScales, (v, k) => {
			console.log('Axes: ' + k)
			console.log('Domain: ' + JSON.stringify(v.domain()))
			console.log('Range: ' + JSON.stringify(v.range()))
		})
	},

	getAxesScales: function () {
		this.axesScales.x = this.getScaleByField(this.data.xField)
		this.axesScales.y = this.getScaleByField(this.data.yField)
		this.axesScales.z = this.getScaleByField(this.data.zField)
		this.logAxesInfo()
	},

	getScaleByField: function (field) {
		if (!field) {
			return null
		}
		console.log('Setting axis field ' + field)
		let fieldTypes
		if (this.fieldData[field]) {
			switch (this.fieldData[field].type) {
				default:
					let extent = d3.extent(this.clusterData.map((d) => d[field]))
					return d3.scaleLinear().range(cfg.clusterRange).domain(extent)
			}
		} else {
			fieldTypes = [...new Set(this.clusterData.map((d) => d[field]))]
			return d3.scalePoint().range(cfg.clusterRange).domain(fieldTypes)
		}
	}
})
//export default api
