<script>
	import { onMount } from 'svelte'

	import DataWhip from './AF_DataWhip.svelte'
	import AFrameBoidsGUI from './AFrameBoidsGUI.svelte'

	export let width = 64 //32
	export let height = 64

	function getParam(_param = '', deflt = 0) {
		let param = new URLSearchParams(window.location.search).get(_param)
		if (param) return +param
		return deflt
	}

	let GUIConfig = [
		{
			label: 'Set your sky-box',
			name: 'sky',
			type: 'select',
			default: 'sunset',
			options: [
				'sunset',
				'italy',
				'smog',
				'urriellu',
				'ashFalls',
				'marbleCanyon',
				'houses',
				'morioka',
				'yoplivia'
			]
		},
		{
			label: 'Choose some preset variables',
			name: 'preset',
			type: 'select',
			options: ['default', 'sober', 'wild', 'organized'],
			/** @param {string} v*/
			onChange: (v) => setPreset(v)
		},
		{
			label: 'Number of boids',
			name: 'boidNum',
			type: 'select',
			options: [
				{ label: 'Low ~2000', value: '32_64' },
				{ label: 'Medium ~4000', value: '64_64' },
				{ label: 'High ~8000', value: '64_128' },
				{ label: 'Very High ~16000', value: '128_128' }
			],
			/** @param {string} v*/
			onChange: (v) => setBoidNumber(v)
		},
		{
			label: 'Velocity',
			name: 'velMult',
			type: 'range',
			min: 0.1,
			max: 10.0,
			step: 0.01
		},
		{
			label: 'Separation distance',
			name: 'separation',
			type: 'range',
			min: 0.01,
			max: 100.0,
			step: 0.1
		},
		{
			label: 'Alignment',
			name: 'alignment',
			type: 'range',
			min: 0.01,
			max: 100.0,
			step: 0.1
		},
		{
			label: 'Cohesion',
			name: 'cohesion',
			type: 'range',
			min: 0.01,
			max: 100.0,
			step: 0.1
		},
		{
			label: 'Freedom',
			name: 'freedom',
			type: 'range',
			min: 0,
			max: 5.0,
			step: 0.01
		},
		{
			label: 'Boid controller strength',
			name: 'strength',
			type: 'range',
			min: 0,
			max: 10.0,
			step: 0.01
		}
	]

	let loaded = false
	onMount(() => {
		loaded = true
	})

	$: GUIValues = {
		separation: 9.0, //20.0,
		alignment: 80.0, //20.0,
		cohesion: 80.0, //20.0,
		freedom: 0.75,
		velMult: 1.0,
		strength: 1.0,
		sky: 'sunset',
		preset: 'default',
		boidNum: '64_64'
	}

	//$: setPreset(GUIValues.preset)
	//$: ec = effectController

	let particleData = ''
	// $: width = getParam('width', width)
	// $: height = getParam('width', height)
	$: {
		particleData = `sim: boids; width: ${width}; height: ${height}; separation: ${GUIValues.separation}; alignment: ${GUIValues.alignment}; cohesion: ${GUIValues.cohesion}; freedom: ${GUIValues.freedom}; velMult: ${GUIValues.velMult}; `
		console.log('Particle data: ', particleData)
	}

	//let sky = '#sky_' + effectController.sky
	$: valuesChanger = () => {
		//console.log('effect-controller: ', effectController)
		GUIValues = GUIValues
	}

	let effectPresets = {
		default: [9, 80, 80, 0.75],
		sober: [20, 20, 20, 0.75],
		wild: [4, 40, 40, 5],
		organized: [15, 60, 60, 1.2]
	}

	$: setPreset = (p) => {
		let vals = effectPresets[p]
		GUIValues.separation = vals[0]
		GUIValues.alignment = vals[1]
		GUIValues.cohesion = vals[2]
		GUIValues.freedom = vals[3]
		//valuesChanger()
		// dispatch('change')
	}

	$: setBoidNumber = (v) => {
		const [_width, _height] = v.split('_')

		width = +_width
		height = +_height
	}
</script>

<a-sky src={'#sky_' + GUIValues.sky} radius="5000" />
<a-entity data-particles={particleData} />
<AFrameBoidsGUI {GUIConfig} bind:GUIValues />
{#if loaded}
	<DataWhip hand="right" strength={GUIValues.strength} />
	<!-- <DataWhip hand="left" /> -->
{/if}

<style>
	:global(.lil-gui input[type='number']) {
		height: initial;
	}
</style>
