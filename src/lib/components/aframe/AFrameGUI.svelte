<script>
	import { onMount } from 'svelte'
	// import GUI from 'lil-gui'
	import Select from '@components/ui/Select.svelte'
	import Range from '@components/ui/Range.5.svelte'

	/** @type {{type:string, name:string, options:object[] | string[], label:string, min:number, max:number, step:number, onChange:function}[]} */

	let {
		config = [],
		values,
		setValue,
		debug = false,
		width = 300,
		position = '0 -1 0.5',
		padding = '1em',
		activeFields = []
	} = $props()

	let changeFlag = $state(true)
	let state = $state(true)

	let guiContainer
	let gui
	onMount(() => {})
	let getContainerStyle = () => {
		if (!debug) {
			return `visibility: hidden; width: ${width}px; padding: ${padding}`
		} else {
			return `visibility: default; width: ${width}px; padding: ${padding}; position: fixed; z-index: 999`
		}
	}
	$effect(() => {
		//console.log('State changed: ', state)
		console.log('Values changed: ', values)
	})

	let selectChanged = (/** @type {{ onChange: any; }} */ input) => {
		console.log('Select changed: ', input)
		if (input.onChange) return input.onChange
		else {
			console.log('Making select callback')
			return (select) => {
				changeFlag = !changeFlag
				if (select !== null) {
					console.log(input.name, select.value)
					console.log(values)
					setValue({ key: input.name, value: select.value })
				}
			}
		}
	}

	let rangeChanged = (input) => {
		return (e) => {
			const value = +e.target.value
			console.log(`${input.name} changed: `, value)
			setValue({ key: input.name, value })
		}
		//setValue({key: input.name, value})
	}

	const isActiveField = (field) => {
		const flag = activeFields.includes(field)
		return flag
	}
</script>

<!-- {#if !debug} -->
<a-sphere color="black" radius="0.01" id="cursor" material="shader:flat" visible="false"></a-sphere>
{#key changeFlag}
	<a-entity look-at-camera="[camera]" html={`html:#ui; cursor: #cursor;`} {position} />
{/key}
<!-- {/if} -->
<div
	id="aframe-gui-container"
	bind:this={guiContainer}
	style={getContainerStyle()}
	data-theme="light"
>
	<div class="ui" id="ui">
		{#each config as input}
			{@const value = values[input['name']]}
			<div class="ui-wrapper" class:inactive={!isActiveField(input['name'])}>
				{#if input['type'] === 'select'}
					<Select
						selected={value}
						name={input['name']}
						options={input['options']}
						label={input['label']}
						handle={selectChanged(input)}
					/>
				{/if}
				{#if input['type'] === 'range'}
					<Range
						label={input.label}
						{value}
						max={input.max}
						min={input.min}
						step={input.step}
						onChange={rangeChanged(input)}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	#aframe-gui-container {
		background: #eee;
		/* border-radius: 1em; */
		position: relative;
		top: 0;
		right: 0;
		/* font-size: calc(var(--pico-font-size) * 0.8); */
		font-size: 80%;
		/* display: inline-block; */
	}

	.ui {
		background: #eee;
		position: relative;
		top: 0;
		right: 0;
		padding: 1em;
		border-radius: 1em;
		/* background: #111; */
	}

	.inactive {
		pointer-events: none;
		display: none;
	}
</style>
