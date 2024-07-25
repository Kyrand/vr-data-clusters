<script>
	import { getContext } from 'svelte'
	const { custom, width, height } = getContext('LayerCake')

	export let annotations = []
	let moving = false
	let cumX, cumY

	$: target = $custom.mouseTarget
	// $: cumX = $custom.mouseTarget.x
	// $: cumY = $custom.mouseTarget.y

	function onMouseMove(e) {
		if (moving && target) {
			// dealing with % based coords
			target.x += 100 * (e.movementX / $width)
			target.y += 100 * (e.movementY / $height)
			console.log('Mouse-target: ', target)
			//$custom.mouseTarget = target
			annotations = annotations
			// target.x = cumX
			// target.y = cumY
		}
	}
	function onMouseDown() {
		console.log('Mouse-down!')
		moving = true
		//cumX = 0
		//cumY = 0
	}
	function onMouseUp() {
		console.log('Mouse-up!')
		moving = false
		target = null
	}
	// LOGS
	//$: console.log('Target: ', $custom.mouseTarget)
</script>

<div class="mousepad" on:mousedown={onMouseDown} on:mouseup={onMouseUp} on:mousemove={onMouseMove}>
	<slot />
</div>

<style>
	.mousepad {
		/* border: 1px solidred; */
		width: 100%;
		height: 100%;
	}
</style>
