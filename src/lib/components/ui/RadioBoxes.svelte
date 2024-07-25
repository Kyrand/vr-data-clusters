<script>
	export let options = []
	export let value = ''
	export let legend = 'placeholder'
	export let name = 'radio'

	$: if (value === '') {
		value = options[0].value
	}
</script>

<fieldset>
	<legend>{legend}</legend>
	{#each options as opt, i}
		<label for={`radio-${i}`}>
			<input
				bind:group={value}
				type="radio"
				id={`radio-${i}`}
				{name}
				value={opt.value}
			/>{opt.label}
		</label>
	{/each}
</fieldset>

<style>
	legend {
		font-weight: 500;
	}
</style>
