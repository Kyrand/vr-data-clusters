<script>
	export let value = ''
	export let minRows = 1
	export let maxRows
	export let editing

	$: minHeight = `${1 + minRows * 1.2}em`
	$: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`
</script>

<div class="text-container">
	<pre aria-hidden="true" style="min-height: {minHeight}; max-height: {maxHeight}">{value +
			'\n'}</pre>

	<textarea
		on:blur={() => {
			editing = false
			console.log('Blurring..')
		}}
		bind:value
		autofocus
	/>
</div>

<style>
	.text-container {
		position: relative;
	}

	pre {
		font-family: initial;
		background: none;
	}
	pre,
	textarea {
		/* font-family: inherit; */
		font-family: var(--chart-font-family);
		font-size: calc(var(--chart-font-size) * 0.8);
		padding: 0.5em;
		box-sizing: border-box;
		border: 1px solid #eee;
		line-height: 1.2;
		overflow: hidden;
		margin: 0;
	}

	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
	}
</style>
