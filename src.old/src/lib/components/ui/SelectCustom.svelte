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
	export let background = '#111'
	export let color = '#ddd'
	// LOGS
	$: {
		console.groupCollapsed('select')
		console.warn('Options: ', options)
		console.warn('Selected: ', selected)
		console.groupEnd()
	}

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
			return `background: ${background}; color: ${color} `
		} else {
			return `background: transparent; color: transparent;`
		}
	}
</script>

<div class={cls + 'select__wrapper'}>
	{#if label}
		<div class="label">{label}</div>
	{/if}
	<div class="selected" on:click={handleOpen}>{selectedLabel}</div>
	<!-- <div class="options" style={`display: ${open ? 'block' : 'none'}`}> -->
	<div class="options" class:closed={!open}>
		<div class="_options__abs">
			{#each _options as opt}
				<div
					style={getOptionStyle()}
					class:selected={selected === opt.value}
					on:click={() => handleSelect(opt)}
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
		background: #333;
	}

	.closed {
		pointer-events: none;
		display: none;
	}
</style>
