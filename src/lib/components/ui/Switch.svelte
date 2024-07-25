<script>
	export let label = 'placeholder'
	export let flag = true
	export let id = 'switch'
	export let cbk = null

	$: clickHandler = () => {
		flag = !flag
		if (cbk) {
			cbk(flag)
		}
	}
</script>

<label for={id}>
	<input type="checkbox" {id} name={id} role="switch" checked={flag} on:click={clickHandler} />
	<span>{label}</span>
</label>

<style>
	label span {
		font-weight: 500;
	}
</style>
