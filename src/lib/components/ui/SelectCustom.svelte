<script>
	export let callback = (e) => console.log(e)
	export let label = ''
	export let options = []
	import { tick } from 'svelte'
	/**
	 * @type boolean state
	 */
	export let state
	/**
	 * @type string
	 */
	export let selected
	export let cls = ''
	export let open = false
	export let background = '#fefefe'
	export let color = '#333'
	// LOGS
	// $: {
	// 	console.groupCollapsed('select')
	// 	console.warn('Options: ', options)
	// 	console.warn('Selected: ', selected)
	// 	console.groupEnd()
	// }

	let _options = []
	let selectedLabel = ''
	$: {
		_options =
			typeof options[0] === 'object' ? options : options.map((d) => ({ value: d, label: d }))
		selectedLabel = _options.find((d) => d.value === selected).label
	}

	$: handleSelect = async (opt) => {
		console.log('Selecting: ', opt)
		if (open) {
			selected = opt.value
			open = false
			callback(opt.value)
			await tick
			state = !state
		}
	}

	$: handleOpen = () => {
		open = !open
		state = !state
		console.log('Opened: ', open)
	}

	$: getOptionStyle = () => {
		if (open) {
			return ``
			//`background: ${background}; color: ${color} `
		} else {
			return `background: transparent; color: transparent;`
		}
	}

	$: console.log(`Open-flag: ${open}`)
</script>

<div class={cls + 'select__wrapper'}>
	{#if label}
		<div class="label">{label}</div>
	{/if}
	<div class="select minimal" on:click={handleOpen}>{selectedLabel}</div>
	<!-- <div class="options" style={`display: ${open ? 'block' : 'none'}`}> -->
	<div class="options" class:closed={!open}>
		<div class="_options__abs">
			{#each _options as opt}
				<div
					style={getOptionStyle()}
					class:selected={selected === opt.value}
					on:click={() => handleSelect(opt)}
					class="option"
				>
					{opt.label}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.label {
		font-weight: 500;
		color: var(--pico-color);
		/* background: ; */
	}

	.options__abs {
		position: absolute;
		width: 100%;
	}

	.select__wrapper {
		display: flex;
		flex-direction: column;
	}

	.select-wrapper select {
		flex: 1;
	}

	.selected {
		/* background: #333; */
		color: var(--pico-color);
		background: #fff;
	}

	.closed {
		pointer-events: none;
		display: none;
	}

	.select {
		/* styling */
		background-color: white;
		border: thin solid #333;
		border-radius: 4px;
		display: inline-block;
		font: inherit;
		line-height: 1.5em;
		padding: 0.5em 3.5em 0.5em 1em;

		/* reset */

		margin: 0;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-appearance: none;
		-moz-appearance: none;
	}

	.options {
		background-color: white;
		border: thin solid #333;
		border-radius: 4px;
		font: inherit;
		line-height: 1.5em;
		padding: 0.5em 3.5em 0.5em 1em;
	}

	.option {
		background-color: #fff;
		color: #333;
	}

	.option:hover {
		background-color: #eee;
		color: #333;
	}

	.select.minimal {
		background-image: linear-gradient(45deg, transparent 50%, gray 50%),
			linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc);
		background-position:
			calc(100% - 20px) calc(1em + 2px),
			calc(100% - 15px) calc(1em + 2px),
			calc(100% - 2.5em) 0.5em;
		background-size:
			5px 5px,
			5px 5px,
			1px 1.5em;
		background-repeat: no-repeat;
		color: var(--pico-color);
		/* background: #fff; */
	}

	.select.minimal:focus {
		background-image: linear-gradient(45deg, green 50%, transparent 50%),
			linear-gradient(135deg, transparent 50%, green 50%), linear-gradient(to right, #ccc, #ccc);
		background-position:
			calc(100% - 15px) 1em,
			calc(100% - 20px) 1em,
			calc(100% - 2.5em) 0.5em;
		background-size:
			5px 5px,
			5px 5px,
			1px 1.5em;
		background-repeat: no-repeat;
		border-color: green;
		outline: 0;
	}
</style>
