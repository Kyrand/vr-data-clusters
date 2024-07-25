import * as d3 from 'd3'

export default (S) => {
	let AFData, data, axesScales, fieldData, fields
	const { el, fromArray, toArray, textLabels } = S
	const Globe = d3.select(el).select('.globe').node().components['globe'].globe
	console.log('Globe: ', Globe)

	let scaleV3 = (v, scale) => {
		return { x: v.x * scale, y: v.y * scale, z: v.z * scale }
	}

	return {
		update() {
			//const c = d3.select(el).select('.globe').components['globe']
			;({ AFData, data, axesScales, fieldData, fields } = S)

			data.forEach((d, i) => {
				let coords
				const tempV = new THREE.Vector3()
				if (d[AFData.geoField]) {
					const [lat, lon] = d[AFData.geoField].split(',').map((d) => +d)
					coords = Globe.getCoords(lat, lon, 0.05)
					console.log('Coords: ', coords)
				} else {
					coords = { x: 0, y: 0, z: 0 }
				}
				tempV.set(coords.x, coords.y, coords.z)
				//coords = scaleV3(coords, AFData.geoScale)
				Globe.localToWorld(tempV)
				coords = tempV
				fromArray[i * 3 + 0] = toArray[i * 3 + 0]
				fromArray[i * 3 + 1] = toArray[i * 3 + 1]
				fromArray[i * 3 + 2] = toArray[i * 3 + 2]
				toArray[i * 3 + 0] = coords.x
				toArray[i * 3 + 1] = coords.y
				toArray[i * 3 + 2] = coords.z
			})
		}
	}
}
