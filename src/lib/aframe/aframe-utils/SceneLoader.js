import * as d3 from 'd3'
import _ from 'lodash'
import config from '@lib/aframe/config'

export default function () {
	let sceneEl = d3.select('a-scene a-entity.scene')

	let api = {}
	api.addTemplate = (template, options, _parentEl = null, type = 'nunjucks') => {
		let parentEl = sceneEl
		if (_parentEl) parentEl = sceneEl.select(_parentEl)
		let el = parentEl
			.append('a-entity')
			.attr('template', `src: templates/${template}.html; type:${type}`)

		_.each({ ...config.components[template], ...options }, (v, k) => {
			el.attr('data-' + k, v)
		})
	}

	return api
}
