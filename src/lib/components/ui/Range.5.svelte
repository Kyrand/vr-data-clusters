<script>
	import { onMount } from 'svelte'
	let { value = 0.5, min = 0, max = 1, step = 'any', label = '', onChange } = $props()

	$effect(() => {
		console.log('Value: ', value)
	})
</script>

<div class="_range__wrapper">
	{#if label}
		<label>{label}</label>
	{/if}
	<div class="range__wrapper">
		<!-- <input bind:value={rvalue} type="range" {rmin} {rmax} /> -->
		<div class="range__slider">
			<!-- <input bind:value={rvalue} type="range" min={rmin} max={rmax} /> -->
			<input on:input={onChange} bind:value type="range" {min} {max} {step} />
		</div>
		<div class="range__value">{value.toFixed(2)}</div>
	</div>
</div>

<style>
	.range__wrapper {
		display: grid;
		grid-template-columns: 3fr 1fr;
		align-items: center;
		gap: 1em;
	}

	.range__slider {
		grid-column: 1;
	}

	.range__value {
		grid-column: 2;
		width: 80px;
	}

	input {
		margin-bottom: 0;
	}

	.input,
	._value {
		display: inline-block;
		vertical-align: middle;
	}
</style>
