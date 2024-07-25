//import {slice} from "./array";
//import identity from "./identity";
//import "aframe-look-at-component"

let slice = Array.prototype.slice
let identity = (x) => x

var top = 1,
	right = 2,
	bottom = 3,
	left = 4,
	epsilon = 1e-6

function translateX(x) {
	//return "translate(" + (x + 0.5) + ",0)";
	return `${x + 0.0} 0 0`
}

function translateY(y) {
	//return "translate(0," + (y + 0.5) + ")";
	return `0 ${y + 0.0} 0 `
}

function number(scale) {
	return function (d) {
		return +scale(d)
	}
}

function center(scale) {
	//var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
	var offset = Math.max(0, scale.bandwidth()) / 2 // Adjust for 0.5px offset.
	if (scale.round()) offset = Math.round(offset)
	return function (d) {
		return +scale(d) + offset
	}
}

function entering() {
	return !this.__axis
}

function axis(orient, scale) {
	var tickArguments = [],
		tickValues = null,
		tickFormat = null,
		tickSizeInner = 0.05, //6,
		tickSizeOuter = 0.05, //6,
		tickPadding = 0.02, //3,
		k = orient === top || orient === left ? -1 : 1,
		x = orient === left || orient === right ? 'x' : 'y',
		transform = orient === top || orient === bottom ? translateX : translateY

	function axis(context) {
		var values =
				tickValues == null
					? scale.ticks
						? scale.ticks.apply(scale, tickArguments)
						: scale.domain()
					: tickValues,
			format =
				tickFormat == null
					? scale.tickFormat
						? scale.tickFormat.apply(scale, tickArguments)
						: identity
					: tickFormat,
			spacing = Math.max(tickSizeInner, 0) + tickPadding,
			range = scale.range(),
			range0 = +range[0], // + 0.5,
			range1 = +range[range.length - 1], // + 0.5,
			position = (scale.bandwidth ? center : number)(scale.copy()),
			selection = context.selection ? context.selection() : context,
			path = selection.selectAll('.domain').data([null]),
			tick = selection.selectAll('.tick').data(values, scale).order(),
			tickExit = tick.exit(),
			tickEnter = tick.enter().append('a-entity').attr('class', 'tick'),
			// .attr("look-at", "[camera]"),
			line = tick.select('line'),
			text = tick.select('text'),
			currentColor = context.style('color') || '#333',
			pos

		//text.attr('look-at-camera', '[camera]')

		path = path.merge(
			path.enter().insert('path', '.tick').attr('class', 'domain').attr('stroke', 'currentColor')
		)

		tick = tick.merge(tickEnter)

		let end = x === 'x' ? `${k * tickSizeInner} 0 0` : `0 ${k * tickSizeInner} 0`
		line = line.merge(
			tickEnter.append('a-entity').attr('line', `end: ${end}; color: ${currentColor}`)
		)

		// .attr("stroke", "currentColor")
		// .attr(x + "2", k * tickSizeInner));

		text = text.merge(
			tickEnter
				.append('a-text')
				.attr('width', 0.2)
				.attr('wrap-count', 8)
				.attr('color', currentColor)
				.attr('position', `${k * spacing} 0 0`)
				.attr('look-at-camera', '[camera]')
		)
		//.attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

		if (context !== selection) {
			path = path.transition(context)
			tick = tick.transition(context)
			line = line.transition(context)
			text = text.transition(context)

			tickExit = tickExit
				.transition(context)
				.attr('opacity', epsilon)
				//.attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });
				.attr('position', function (d) {
					return isFinite((d = position(d))) ? transform(d) : this.getAttribute('position')
				})

			tickEnter
				.attr('opacity', epsilon)
				// .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
				.attr('position', function (d) {
					var p = this.parentNode.__axis
					return transform(p && isFinite((p = p(d))) ? p : position(d))
				})
		}

		tickExit.remove()

		// path
		//     .attr("d", orient === left || orient == right
		//         ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
		//         : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1));

		tick
			.attr('opacity', 1)
			//.attr("transform", function(d) { return transform(position(d)); });
			.attr('position', function (d) {
				return transform(position(d))
			})

		end = x === 'x' ? `${k * tickSizeInner} 0 0` : `0 ${k * tickSizeInner} 0`
		line.attr('line', `end: ${end}; color: ${currentColor}`)
		//.attr(x + "2", k * tickSizeInner);

		pos = x === 'x' ? `${k * spacing} 0 0` : `0 ${k * spacing} 0`
		text
			.attr('position', pos)
			.attr('value', format)
			//.attr("anchor", "left" )
			//.attr("height", )
			.attr('anchor', orient === right ? 'left' : orient === left ? 'right' : 'center')
			.attr('align', orient === right ? 'left' : orient === left ? 'right' : 'center')
		//.text(format);

		selection
			.filter(entering)
			.attr('fill', 'none')
			.attr('font-size', 10)
			.attr('font-family', 'sans-serif')
			.attr('anchor', orient === right ? 'left' : orient === left ? 'right' : 'center')

		selection.each(function () {
			this.__axis = position
		})
	}

	axis.scale = function (_) {
		return arguments.length ? ((scale = _), axis) : scale
	}

	axis.ticks = function () {
		return (tickArguments = slice.call(arguments)), axis
	}

	axis.tickArguments = function (_) {
		return arguments.length
			? ((tickArguments = _ == null ? [] : slice.call(_)), axis)
			: tickArguments.slice()
	}

	axis.tickValues = function (_) {
		return arguments.length
			? ((tickValues = _ == null ? null : slice.call(_)), axis)
			: tickValues && tickValues.slice()
	}

	axis.tickFormat = function (_) {
		return arguments.length ? ((tickFormat = _), axis) : tickFormat
	}

	axis.tickSize = function (_) {
		return arguments.length ? ((tickSizeInner = tickSizeOuter = +_), axis) : tickSizeInner
	}

	axis.tickSizeInner = function (_) {
		return arguments.length ? ((tickSizeInner = +_), axis) : tickSizeInner
	}

	axis.tickSizeOuter = function (_) {
		return arguments.length ? ((tickSizeOuter = +_), axis) : tickSizeOuter
	}

	axis.tickPadding = function (_) {
		return arguments.length ? ((tickPadding = +_), axis) : tickPadding
	}

	return axis
}

export function axisTop(scale) {
	return axis(top, scale)
}

export function axisRight(scale) {
	return axis(right, scale)
}

export function axisBottom(scale) {
	return axis(bottom, scale)
}

export function axisLeft(scale) {
	return axis(left, scale)
}
