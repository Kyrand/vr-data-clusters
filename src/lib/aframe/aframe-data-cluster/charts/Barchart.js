// import "./index.css"
import * as d3 from 'd3'
import afu from '../../aframe-utils'

const defaultOpts = {
	width: 1280,
	height: 1280,
	fillStyle: 'steelblue',
	strokeStyle: 'black',
	margin: { top: 100, right: 50, bottom: 50, left: 50 },
	maxBars: 30,
	background: 'white'
}

export default (_opts) => {
	let opts = { ...defaultOpts, ..._opts }
	let xKey = opts.xKey
	let yKey = opts.yKey

	let api = {}
	let canvas = opts.canvas
	if (!canvas) canvas = document.createElement('canvas')
	canvas.width = opts.width
	canvas.height = opts.height
	let width = canvas.width - opts.margin.left - opts.margin.right
	let height = canvas.height - opts.margin.top - opts.margin.bottom

	let ctx = canvas.getContext('2d')

	let x = d3.scaleBand().rangeRound([0, width]).padding(0.1)

	let y = d3.scaleLinear().rangeRound([height, 0])

	ctx.translate(opts.margin.left, opts.margin.top)
	ctx.font = '18px sans-serif'

	api.update = (_data) => {
		let data = api.dataFilter(_data)
		x.domain(
			data.map(function (d) {
				return d.key
			})
		)
		y.domain([
			0,
			d3.max(data, function (d) {
				return d.value
			})
		])

		var yTickCount = 10,
			yTicks = y.ticks(yTickCount)
		// yTickFormat = y.tickFormat(yTickCount, "%")
		// First clear to white (VR gives it a black background)
		ctx.fillStyle = opts.background
		ctx.fillRect(-opts.margin.left, -opts.margin.top, canvas.width, canvas.height)
		ctx.fillStyle = opts.strokeStyle

		ctx.beginPath()
		x.domain().forEach(function (d) {
			ctx.moveTo(x(d) + x.bandwidth() / 2, height)
			ctx.lineTo(x(d) + x.bandwidth() / 2, height + 6)
		})
		ctx.strokeStyle = opts.strokeStyle
		ctx.stroke()

		ctx.textAlign = 'center'
		ctx.textBaseline = 'top'
		x.domain().forEach(function (d) {
			ctx.fillText(d, x(d) + x.bandwidth() / 2, height + 6)
		})

		ctx.beginPath()
		yTicks.forEach(function (d) {
			ctx.moveTo(0, y(d) + 0.5)
			ctx.lineTo(-6, y(d) + 0.5)
		})
		ctx.strokeStyle = opts.strokeStyle
		ctx.stroke()

		ctx.textAlign = 'right'
		ctx.textBaseline = 'middle'
		yTicks.forEach(function (d) {
			//ctx.fillText(yTickFormat(d), -9, y(d))
			ctx.fillText(d, -9, y(d))
		})

		ctx.beginPath()
		ctx.moveTo(-6.5, 0 + 0.5)
		ctx.lineTo(0.5, 0 + 0.5)
		ctx.lineTo(0.5, height + 0.5)
		ctx.lineTo(-6.5, height + 0.5)
		ctx.strokeStyle = opts.strokeStyle
		ctx.stroke()
		// y-label
		ctx.save()
		ctx.rotate(-Math.PI / 2)
		ctx.textAlign = 'right'
		ctx.textBaseline = 'top'
		ctx.font = 'bold 14px sans-serif'
		ctx.fillText(opts.xLabel || 'count', -10, 10)
		ctx.restore()
		// title
		ctx.textAlign = 'center'
		ctx.font = '36px sans-serif'
		ctx.fillText('Count by ' + opts.xKey, width / 2, -opts.margin.top / 2)

		ctx.fillStyle = opts.fillStyle
		data.forEach(function (d) {
			ctx.fillRect(x(d.key), y(d.value), x.bandwidth(), height - y(d.value))
		})
	}

	api.canvas = (_canvas = null) => {
		if (!_canvas) return canvas
		canvas = _canvas
		return api
	}

	api.dataFilter = (_data) => {
		let data = d3
			.nest()
			.key((d) => d[xKey])
			.rollup((leaves) => leaves.length)
			.entries(_data)
		afu.log('Filtered data', data)
		// if we've too many groups we'll need to box them
		if (data.length > opts.maxBars) {
			// is this numerical?
			if (_data.slice(0, 10).every((d) => !isNaN(Number(d[xKey])))) {
				return bucketNumbers(_data.map((d) => d[xKey]))
			}
		}
		//return data.map(d => {return {key: d.key, value: d.values}})
		return data
	}

	let bucketNumbers = (nums, bucketNum = 20) => {
		let range = d3.extent(nums)
		let span = (range[1] - range[0] + 0.01) / bucketNum
		let buckets = [...Array(bucketNum)].map((e) => [])
		nums.forEach((n) => {
			let slot = Math.floor((n - range[0]) / span)
			if (slot < 0 || slot >= bucketNum) {
				afu.log('oops - out of bounds!', n)
			} else buckets[slot].push(n)
		})
		return buckets.map((v, i) => {
			return {
				key: `${lab(i * span)}-${lab((i + 1) * span)}`,
				value: v !== undefined ? v.length : 0
			}
		})
	}

	let lab = (l) => {
		return l.toFixed(1)
	}

	return api
}
