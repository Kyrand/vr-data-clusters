import * as d3 from 'd3'
import { makeText } from '@lib/aframe/aframe-utils/labels'

export default (init) => {
	const { el, AFData, dataset, fromArray, toArray, axesScales } = init
	const clusterData = dataset.data

	function getRandomCloudPoint() {
		let d = AFData.dimensions
		return new THREE.Vector3(
			(Math.random() - 0.5) * d.x,
			(Math.random() - 0.5) * d.y,
			(Math.random() - 0.5) * d.z
		)
	}

	return {
		update() {
			clusterData.forEach((d, i) => {
				let p = getRandomCloudPoint()
				fromArray[i * 3 + 0] = toArray[i * 3 + 0]
				fromArray[i * 3 + 1] = toArray[i * 3 + 1]
				fromArray[i * 3 + 2] = toArray[i * 3 + 2]
				toArray[i * 3 + 0] = p.x
				toArray[i * 3 + 1] = p.y
				toArray[i * 3 + 2] = p.z
			})
		}
	}
}
