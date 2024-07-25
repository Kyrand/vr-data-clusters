<script>
	import { html } from 'd3'

	let { dataset, position = '-1.1 0 0.5', debug = false, lineLength = 35 } = $props()

	const cfg = $derived(dataset.config)

	let lines = $state([])
	$effect(() => {
		// console.log('Dataset: ', dataset)
		// console.log('Lines: ', lines)
		lines = cfg.intro ? chunkText(cfg.intro, lineLength) : []
	})

	function chunkText(textString, lineLength) {
		const words = textString.trim().split(/[\s,\t,\n]+/)
		const lines = []
		let line = []
		let ll = 0
		words.forEach((w) => {
			if (ll + w.length > lineLength) {
				lines.push(line)
				ll = 0
				line = []
			}
			line.push(w)
			ll += w.length
		})
		if (line.length) {
			lines.push(line)
		}
		console.log('Lines: ', lines)
		return lines
	}
</script>

<div
	id="dsDetails"
	data-theme="light"
	style={`visibility: ${!debug ? 'hidden' : 'visible'}; --font-size: 1.1em; --typography-spacing-vertical: 0.014em; `}
	onclick={() => console.log('Clicked me!')}
>
	{#if cfg.img}
		<div class="img">
			<img src={`/assets/images/${cfg.img}`} alt="" />
		</div>
	{/if}
	<h2>{cfg.title}</h2>
	{#each lines as line}
		<p>{@html line.join(' ')}</p>
	{/each}
</div>

<a-sphere color="black" radius="0.01" id="cursor" material="shader:flat" visible="false"></a-sphere>
<a-entity look-at-camera="[camera]" html={`html:#dsDetails; cursor: #cursor;`} {position} />

<style>
	#dsDetails {
		position: absolute;
		z-index: 999;
		font-size: 1.2em;
		padding: 1em;
		border-radius: 1em;
		/* visibility: hidden; */
		width: 26em;
		& .img {
			margin: auto;
		}
		& img {
			display: block;
			margin: auto;
		}
		background-color: #fff;
		& h2 {
			margin-bottom: 1em;
		}
	}
</style>
