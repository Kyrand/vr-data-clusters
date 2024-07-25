<script>
	import { onMount } from 'svelte'
	import { rune } from '@lib/aframe/aframe-data-cluster/runeStore'

	export let dataset

	$: console.log(dataset)
	$: rune(dataset)
</script>

<slot />
