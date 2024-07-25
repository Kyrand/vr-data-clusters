/* global THREE, d3 */
import * as d3 from 'd3'

export function makeTextSprite(message, parameters) {
	if (parameters === undefined) parameters = {}

	var fontface = parameters.hasOwnProperty('fontface') ? parameters['fontface'] : 'Arial'

	var fontsize = parameters.hasOwnProperty('fontsize') ? parameters['fontsize'] : 14

	var borderThickness = parameters.hasOwnProperty('borderThickness')
		? parameters['borderThickness']
		: 4

	var borderColor = parameters.hasOwnProperty('borderColor')
		? parameters['borderColor']
		: { r: 0, g: 0, b: 0, a: 1.0 }

	var backgroundColor = parameters.hasOwnProperty('backgroundColor')
		? parameters['backgroundColor']
		: { r: 255, g: 255, b: 255, a: 1.0 }

	//var spriteAlignment = THREE.SpriteAlignment.topLeft

	var canvas = document.createElement('canvas')
	var context = canvas.getContext('2d')
	context.font = 'Bold ' + fontsize + 'px ' + fontface

	// get size data (height depends only on font size)
	var metrics = context.measureText(message)
	var textWidth = metrics.width

	// background color
	context.fillStyle =
		'rgba(' +
		backgroundColor.r +
		',' +
		backgroundColor.g +
		',' +
		backgroundColor.b +
		',' +
		backgroundColor.a +
		')'
	// border color
	context.strokeStyle =
		'rgba(' + borderColor.r + ',' + borderColor.g + ',' + borderColor.b + ',' + borderColor.a + ')'

	context.lineWidth = borderThickness
	roundRect(
		context,
		borderThickness / 2,
		borderThickness / 2,
		textWidth + borderThickness,
		fontsize * 1.4 + borderThickness,
		6
	)
	// 1.4 is extra height factor for text below baseline: g,j,p,q.

	// text color
	context.fillStyle = 'rgba(0, 0, 0, 1.0)'

	context.fillText(message, borderThickness, fontsize + borderThickness)

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
	texture.needsUpdate = true

	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false })
	var sprite = new THREE.Sprite(spriteMaterial)
	//sprite.scale.set(100,50,1.0)
	//sprite.scale.set(2, 1, 1.0)
	return sprite
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
	ctx.beginPath()
	ctx.moveTo(x + r, y)
	ctx.lineTo(x + w - r, y)
	ctx.quadraticCurveTo(x + w, y, x + w, y + r)
	ctx.lineTo(x + w, y + h - r)
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
	ctx.lineTo(x + r, y + h)
	ctx.quadraticCurveTo(x, y + h, x, y + h - r)
	ctx.lineTo(x, y + r)
	ctx.quadraticCurveTo(x, y, x + r, y)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}

export function makeText2(
	parent,
	text,
	pos,
	rot = { x: 0, y: 0, z: 0 },
	scale = 1.0,
	color = '#fff'
) {
	d3.select(parent.node())
		.append('a-entity')
		.attr('position', `${pos.x} ${pos.y} ${pos.z}`)
		.attr('look-at-camera', '[camera]')
		.append('a-entity')
		.attr('rotation', `${rot.x} ${rot.y} ${rot.z}`)
		.attr('scale', `${scale} ${scale} ${scale}`)
		.attr('text', `value: ${text}; color: ${color}; anchor: center; align: center`)
	//.append('a-text')
	// .attr('look-at', '[camera]')
}

export function makeText(_params) {
	const defaulParams = {
		position: { x: 0, y: 0, z: 0 },
		rotation: { x: 0, y: 0, z: 0 },
		color: '#fff',
		scale: 1,
		lookAt: false
	}
	return { ...defaulParams, ..._params }
}
