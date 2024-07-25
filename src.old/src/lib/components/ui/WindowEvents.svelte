<script>
	import { LayerCake, Svg, Html, flatten } from 'layercake'
	import Switch from './Switch.svelte'

	export let mousePos = { x: 0, y: 0 }
	export let mousePosRel = { x: 0, y: 0 }

	let mouseDown = false

	function handleMouseMove(e) {
		mousePos.x = e.clientX
		mousePos.y = e.clientY
	}
</script>

<div class="chart-container">
	<div
		class="mousemat"
		on:mousedown={() => {
			mouseDown = true
		}}
		on:mouseup={() => {
			mouseDown = false
		}}
		on:mousemove={handleMouseMove}
	/>
</div>
<div class="coords">
	Mouse coords:
	<div class="coord">
		<div>{mousePos.x}</div>
		<div>{mousePos.y}</div>
	</div>
	Mouse coords (relative)
	<div class="coord">
		<div>{mousePosRel.x}</div>
		<div>{mousePosRel.y}</div>
	</div>
</div>
<div class="coords" />

<Switch label="Mouse down" bind:flag={mouseDown} />

<style>
	.chart-container {
		width: 600px;
		height: 600px;
	}

	.coord div {
		font-weight: 600;
		display: inline-block;
		width: 40px;
	}
	.mousemat {
		width: 100%;
		height: 100%;
		background: #eee;
	}
</style>
