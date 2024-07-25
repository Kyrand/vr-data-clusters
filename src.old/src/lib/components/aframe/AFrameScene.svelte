<script>
	import { onMount } from 'svelte'
	import AframeAssets from './AFrameAssets.svelte'

	export let stats = false

	let AFRAME = null
	let loaded = false
	onMount(async () => {
		console.log('Mounting VR central...')
		AFRAME = (await import('aframe')).default
		// await import('aframe-orbit-controls')
		try {
			await import('@lib/aframe/AF_components.js')
			console.log('Loaded AFRAME components...')
		} catch (error) {
			console.log(error)
		}
		loaded = true
	})
</script>

{#if loaded}
	<!-- <a-scene {stats} cursor="rayOrigin: mouse" raycaster="objects: [html];"> -->
	<a-scene {stats}>
		<a-entity
			camera
			look-controls="enabled: false"
			orbit-controls="target: 0 0 0; minDistance: 2; maxDistance: 180; initialPosition: 1.5 1.5 1.5; rotateSpeed: 0.5"
		/>
		<AframeAssets />
		<slot />
	</a-scene>
{/if}

<style>
	.ui {
		position: absolute;
		z-index: 99;
	}
</style>
