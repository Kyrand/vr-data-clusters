<script>
	import { onMount } from 'svelte'
	import { addDataset } from '@lib/aframe/aframe-data-cluster/datasetStore.js'

	//export let dataset
	const { dataset, cluster, children } = $props()
	//let _dataset = $state({})
	let _dataset = $state(addDataset(dataset))

	// $effect(() => {
	// 	_dataset = addDataset(dataset)
	// 	//_dataset = 'that'
	// 	//console.log('_dataset', $_dataset)
	// 	//_dataset = 'test'
	// })
	$inspect(dataset)
	$inspect(_dataset, '_dataset')
	//$: console.log(dataset)
	//$: addDataset(dataset)
</script>

<!-- {@render cluster({ dataset: _dataset, test: 'hello mum' })} -->
{@render cluster(_dataset)}
