/* global AFRAME */
import * as d3 from 'd3'
import afu from '.'

AFRAME.registerComponent('state-changer', {
	schema: {
		title: { default: 'test title' },
		desc: { default: 'a little description' },
		stateChange: { default: 'dummy state' }
	},

	init: function () {
		this.defaultPos = this.el.object3D.position.clone()

		d3.select(this.el)
			.classed('state-changer', true)
			// .attr("grab", true)
			.attr('aabb-collider', 'objects: .data-cluster;')

		let that = this
		this.el.addEventListener('hit', (e) => {
			if (e.detail && e.detail.el) {
				console.log('state-changer hitting...')
				e.detail.el.emit('stateChange', { stateChange: this.data.stateChange })
				this.el.object3D.position.copy(this.defaultPos)
			}
		})
	}
})
