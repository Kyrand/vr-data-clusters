<script>
	let {
		colors = { x: '#f00', y: '#0f0', z: '#00f' },
		axesScales,
		scale = 1,
		xField,
		yField,
		zField,
		fieldData
	} = $props()

	function a2s(axis) {
		const { range, domain, padding, type } = axis
		return `range: ${range.join(',')}; domain: ${domain.join(',')}; padding: ${padding}; scale: ${type}`
	}

	const av = (range) => {
		return range[0] + (range[1] - range[0]) / 2
	}

	const v2s = (o) => {
		return `${o.x} ${o.y} ${o.z}`
	}

	/**
	 * @type{[]}
	 */
	let labels = $state([])

	const getFieldData = (field, data) => {
		const f = fieldData[field]
		if (f) {
			const d = f[data]
			if (d) {
				return d
			}
		}
		return null
	}

	function getLabels() {
		const aX = axesScales['x']
		const aY = axesScales['y']
		const aZ = axesScales['z']

		//let groupLabels = d3.select(el).select('.labels .XYZ')
		//groupLabels.selectAll('*').remove()
		// main axis labels
		const cx = av(aX.range)
		const cy = av(aY.range)
		const cz = av(aZ.range)
		let scale = 2
		const labels = [
			{
				text: getFieldData(xField, 'label') || xField,
				position: { x: cx, y: cy, z: aZ.range[0] },
				rotation: { x: 0, y: 0, z: 0 },
				scale,
				color: '#f00'
			},
			{
				text: getFieldData(yField, 'label') || yField,
				position: { x: aX.range[0], y: cy, z: cz },
				rotation: { x: 0, y: 90, z: 90 },
				scale,
				color: '#0f0'
			},
			{
				text: getFieldData(zField, 'label') || zField,
				position: { x: cx, y: aY.range[0], z: cz },
				rotation: { x: -90, y: 90, z: 0 },
				scale,
				color: '#00f'
			}
		]
		return labels
	}

	$effect(() => {
		labels = getLabels()
	})
</script>

<a-entity>
	<!-- X axis -->
	<a-entity
		axis="type: bottom; color: #f00; {a2s(axesScales.x)};"
		position={`${0} ${scale / 2} ${-scale / 2}`}
	></a-entity>
	<!-- Y axis -->
	<a-entity
		axis="type: left; color: #0f0; {a2s(axesScales.y)};"
		position={`-${scale / 2} ${0} ${scale / 2}`}
	></a-entity>
	<!-- Z axis -->
	<a-entity
		axis="type: right; color: #00f; {a2s(axesScales.z)};"
		position={`${scale / 2} ${-scale / 2} ${0}`}
		rotation={`90 0 0`}
	></a-entity>
</a-entity>

<a-entity class="axes__labels">
	{#each labels as label}
		{@const { position, rotation, color, lookAt, scale, text } = label}
		<a-entity position={v2s(position)} look-at-camera={(lookAt && '[camera]') || null}>
			<a-entity
				rotation={v2s(rotation)}
				{scale}
				text={`value: ${text}; color: ${color}; anchor: center; align: center`}
			>
			</a-entity>
		</a-entity>
	{/each}
</a-entity>
