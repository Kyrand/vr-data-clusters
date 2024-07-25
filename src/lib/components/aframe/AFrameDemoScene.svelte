<script>
	import { onMount } from 'svelte'
	import AframeAssets from './AFrameAssets.svelte'
	import Select from '@components/ui/Select.svelte'
	import AFrameBoids from '@components/aframe/data-cluster/AFrameBoids.svelte'

	export let environment = 'egypt'
	export let showEnvironment = true
	export let stats = false

	let AFRAME = null
	let loaded = false
	onMount(async () => {
		console.log('Mounting VR central...')
		AFRAME = (await import('aframe')).default
		try {
			await import('@lib/aframe/AF_components.js')
		} catch (error) {
			console.log(error)
		}
		loaded = true
	})

	let envOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'egypt', label: 'Egypt' },
		{ value: 'checkerboard', label: 'Checkerboard' },
		{ value: 'forest', label: 'Forest' },
		{ value: 'goaland', label: 'Goa land' },
		{ value: 'yavapai', label: 'Yavapai' },
		{ value: 'goldmine', label: 'Gold mine' },
		{ value: 'threetowers', label: 'Three Towers' },
		{ value: 'japan', label: 'Japan' }
	]
	//none, default, contact, egypt, checkerboard, forest, goaland,
	//yavapai, goldmine, threetowers, poison, arches, tron, japan, dream,
	// volcano, starry, osiris, moon
	//$: _environment = showEnvironment ? `preset: ${environment}` : false
</script>

{#if loaded}
	{#if showEnvironment}
		<div class="ui">
			<Select options={envOptions} bind:selected={environment} label="Select an environment" />
		</div>
	{/if}

	<!-- <a-scene environment={`preset: ${environment}`}> -->
	<a-scene
		environment={`preset: ${environment}; active: ${showEnvironment}`}
		{stats}
		cursor="rayOrigin: mouse"
		raycaster="objects: [html];"
	>
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
