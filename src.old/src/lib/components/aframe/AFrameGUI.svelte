<script>
	import { onMount } from 'svelte'
	// import GUI from 'lil-gui'
	import SelectCustom from '@components/ui/SelectCustom.svelte'
	import RangeF from '@components/ui/RangeF.svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	/** @type {{type:string, name:string, options:object[] | string[], label:string, min:number, max:number, step:number, onChange:function}[]} */
	export let GUIConfig = []
	/** @type Object.<string, any>*/
	export let GUIValues = {}
	export let debug = false
	export let width = 600
	export let position = '0 1.6 -0.5'

	let state = true

	let guiContainer
	let gui
	onMount(() => {})
	$: getContainerStyle = () => {
		if (!debug) {
			return `visibility: hidden; width: ${width}px`
		} else {
			return `visibility: default; width: ${width}px`
		}
	}
	$: console.log('State changed: ', state)
	$: selectChanged = (/** @type {{ onChange: any; }} */ input) => {
		if (input.onChange) return input.onChange
		else return () => {}
	}
</script>

<a-entity html={`html:#ui; state: ${state};`} {position} />
<div id="aframe-gui-container" bind:this={guiContainer} style={getContainerStyle()}>
	<div class="ui" id="ui">
		{#each GUIConfig as input}
			{#if input['type'] === 'select'}
				<SelectCustom
					bind:selected={GUIValues[input['name']]}
					options={input['options']}
					label={input['label']}
					bind:state
					callback={selectChanged(input)}
				/>
			{/if}
			{#if input['type'] === 'range'}
				<RangeF
					label={input.label}
					bind:value={GUIValues[input['name']]}
					max={input.max}
					min={input.min}
					step={input.step}
				/>
			{/if}
		{/each}
	</div>
</div>

<style>
	#aframe-gui-container {
		position: relative;
		top: 0;
		right: 0;
		/* display: inline-block; */
	}

	.ui {
		position: relative;
		top: 0;
		right: 0;
		/* background: #111; */
	}
</style>
