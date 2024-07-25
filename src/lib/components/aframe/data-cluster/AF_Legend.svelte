<script>
	import { groups } from 'd3-array'
	import { getColorMapper, v2s } from '@lib/aframe/aframe-data-cluster/utils'
	let {
		colorFieldScheme,
		colorField,
		dataset,
		position = { x: 0.7, y: -0.1, z: 0 },
		scale = `2 2 2`
	} = $props()

	const cField = $derived(
		typeof colorFieldScheme === 'object' ? colorFieldScheme.field : colorField
	)
	const cmap = $derived(getColorMapper(colorFieldScheme, cField, dataset.fieldData[cField].domain))

	const gps = $derived(
		groups(dataset.data, (d) => d[cField]).sort((a, b) => b[1].length - a[1].length)
	)

	$effect(() => {
		console.log(cField, gps, cmap)
	})
</script>

<a-entity position={v2s(position)} {scale}>
	{#each gps as gp, i}
		<a-entity position={`0 -${i * 0.03} 0`}>
			<a-sphere material={`color: ${cmap(gp[1][0]).hex};`} radius={0.01}></a-sphere>
			<a-text scale={`0.12 0.12 0.12`} value={gp[0]} position={`0.02 0 0`}></a-text>
		</a-entity>
	{/each}
</a-entity>
