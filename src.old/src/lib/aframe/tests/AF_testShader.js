import Billboards from './instancedBillboards'

AFRAME.registerComponent('test-shader', {
	schema: {
		testName: { type: 'string', default: 'billboard' }
	},
	init() {
		console.log('Testing shader')
		const bb = Billboards(this.el, AFRAME)
		bb.init()
	}
})
