<script>
	export let callback = (e) => console.log(e)
	export let label = ''
	export let options = []
	export let selected
	export let cls = ''
	// LOGS
	$: {
		console.groupCollapsed('select')
		console.warn('Options: ', options)
		console.warn('Selected: ', selected)
		console.groupEnd()
	}
</script>

<div class={cls}>
	{#if label}
		<label for="field">{label}</label>
	{/if}
	<select bind:value={selected} id="field" required>
		{#each options as opt}
			<option value={opt.value} selected={selected === opt.value}>{opt.label}</option>
		{/each}
	</select>
</div>

<style>
	label {
		font-weight: 500;
	}

	.select-wrapper {
		display: flex;
	}

	.select-wrapper select {
		flex: 1;
	}
</style>
