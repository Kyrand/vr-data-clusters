import * as d3 from 'd3'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
import hexRgb from 'hex-rgb'

// END FIELD SETTERS
export function getColorMapper(colorFieldScheme, colorField, domain) {
	if (typeof colorFieldScheme === 'object') {
		return (d) => {
			const cfs = colorFieldScheme
			let x = cfs.map[d[cfs.field]]
			if (!x) {
				x = cfs.default
			}
			const c = hexRgb(x)
			return { hex: x, col: c }
		}
	} else {
		//let fieldTypes = [...new Set(S.data.map((d) => d[cField]))]
		//console.log(fieldTypes)
		const colorScale = d3.scaleOrdinal().domain(domain).range(d3ScaleChromatic[colorFieldScheme])
		return (d) => {
			let c = colorScale(d[colorField])
			//c = hexRgb(c)
			return { col: hexRgb(c), hex: c }
		}
	}
}

export const v2s = (o) => {
	return `${o.x} ${o.y} ${o.z}`
}
