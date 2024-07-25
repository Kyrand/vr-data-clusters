import * as d3 from 'd3'
import { axisLeft, axisRight, axisBottom, axisTop } from './a-d3-axis'
import consts from '../consts'

AFRAME.registerComponent('axis', {
	schema: {
		type: { type: 'string', default: 'bottom' },
		scale: { type: 'string', default: 'linear' },
		domain: { type: 'array', default: [0, 100] },
		padding: { type: 'number', default: 0.1 },
		range: { type: 'array', default: [0, 100] },
		color: { type: 'string', default: 'red' }
	},

	init: function () {
		// this.dataset = this.el._dataset
		// this.dataset.subscribe((dataset) => {
		// 	this.makeAxis(dataset)
		// })
		this.makeAxis()
	},

	makeAxis: function () {
		const { range, domain, padding } = this.data
		let scale
		switch (this.data.scale) {
			case consts.FIELD_TYPES.Numerical:
				scale = d3.scaleLinear().range(range).domain(domain)
				break
			default:
				scale = d3.scalePoint().range(range).domain(domain).padding(padding)
		}
		// console.log('Axis data: ', this.data)
		switch (this.data.type) {
			case 'left':
				this.axis = axisLeft(scale)
				break
			case 'right':
				this.axis = axisRight(scale)
				break
			case 'bottom':
				this.axis = axisBottom(scale)
				break
			case 'top':
				this.axis = axisTop(scale)
				break
		}
		d3.select(this.el).style('color', this.data.color).call(this.axis)
	},

	update() {
		this.makeAxis()
	},

	tick: function () {
		//this.el.object3D.lookAt(this.data.object3D.position)
		//this.el.object3D.lookAt(this.data.components.camera.camera.position)
	}
})

//import './index.css'
// import * as d3 from 'd3'
// import _ from 'lodash'
// import { axisLeft, axisRight, axisBottom } from './a-d3-axis'
// import 'aframe-look-at-component'
// //import "./index.css"

// let interpolatePosition = function (d, i, a) {
// 	let [x, y, z] = a.split(/\s+/).map(Number)
// 	return (t) => `${(1 - t) * x + t * d.x} ${(1 - t) * y + t * d.y} ${(1 - t) * z + t * z}`
// }

// //.attr("position", (d, i) => `${barScale(i)} ${heightScale(d)/2} 0`)

// export default (_opts) => {
// 	let opts = { barNum: 10, barMax: 100, size: 1, ..._opts }
// 	let api = {}
// 	let scene

// 	let camera = d3
// 		.select('#cameraRig')
// 		.attr('rotation', '-43 45 0')
// 		.attr('position', '1.3, 1.6, 1.2')

// 	function makeBars(size = 10) {
// 		let bars = d3.range(size).map((d) => {
// 			return d3.range(size).map((dd) => Math.random() * opts.barMax)
// 		})
// 		return bars
// 	}

// 	let color = d3
// 		.scaleSequential()
// 		.domain([0, opts.barMax])
// 		//.interpolator(d3.interpolateRainbow)
// 		.interpolator(d3.interpolateWarm)

// 	let barScale = d3.scaleBand().padding(0.1).domain(d3.range(opts.barNum)).range([0, opts.size])

// 	let heightScale = d3.scaleLinear().domain([0, opts.barMax]).range([0, opts.size])

// 	let zAxis = axisLeft(heightScale)
// 	let yAxis = axisRight(barScale)

// 	let chart = d3
// 		.select('a-scene')
// 		.append('a-entity')
// 		.attr('class', 'chart')
// 		.attr('position', '0 0.25 0')

// 	let zAxisEl = chart
// 		.append('a-entity')
// 		.attr('class', 'axis z-axis')
// 		.attr('position', `0 0 ${opts.size}`)

// 	let yAxisEl = chart
// 		.append('a-entity')
// 		.attr('class', 'axis y-axis')
// 		.attr('position', `${opts.size} 0 ${opts.size}`)
// 		.attr('rotation', '-90 0 0')

// 	api.init = (data = null) => {
// 		if (!data) data = makeBars(opts.barNum)

// 		zAxisEl.call(zAxis)
// 		yAxisEl.call(yAxis)

// 		let barGroups = chart
// 			.selectAll('bar-group')
// 			.data(data)
// 			.enter()
// 			.append('a-entity')
// 			.attr('class', 'bar-group')
// 			.attr('position', (d, i) => `0 0 ${barScale(i)}`)

// 		let bars = barGroups
// 			.selectAll('bars')
// 			.data((d) => d)
// 			.enter()
// 			.append('a-box')
// 			.attr('color', (d) => color(d))
// 			.attr('emissive', (d) => color(d))
// 			.attr('position', (d, i) => `${barScale(i)} ${heightScale(d) / 2} 0`)
// 			.attr('depth', barScale.bandwidth())
// 			.attr('width', barScale.bandwidth())
// 			.attr('height', (d) => heightScale(d))

// 		let interpolatePositionList = function (d, i, nodeList) {
// 			let a = nodeList[i].attributes.position.value
// 			let [x, y, z] = a.split(/\s+/).map(Number)
// 			return (t) =>
// 				`${(1 - t) * x + t * barScale(i)} ${(1 - t) * y + (t * heightScale(d)) / 2} ${(1 - t) * z + t * z}`
// 		}

// 		let update = (data = null) => {
// 			if (!data) data = makeBars(opts.barNum)
// 			barGroups.data(data).enter()
// 			//.selectAll("a-box")
// 			bars
// 				.data((d) => d)
// 				.enter()
// 				.merge(bars)
// 				.transition()
// 				.duration(1000)
// 				//.attr("position", (d, i) => `${barScale(i)} ${heightScale(d)/2} 0`)
// 				.attrTween('position', interpolatePositionList)
// 				.attr('color', (d) => color(d))
// 				.attr('height', (d) => heightScale(d))
// 		}

// 		setInterval(update, 5000)
// 	}

// 	//api.update = () => {}

// 	return api
// }
