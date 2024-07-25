<script>
	let { labels } = $props()

	const v2s = (o) => {
		return `${o.x} ${o.y} ${o.z}`
	}
</script>

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
