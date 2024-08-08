<!-- <svelte:head>
	<script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
</svelte:head> -->
<script>
	import { onMount } from 'svelte'

	import afu from '@lib/aframe/aframe-utils'
	//import store from './store'
	import AFrameScene from '@components/aframe/AFrameScene.svelte'
	import AFrameDataCluster from '@components/aframe/data-cluster/AF_DataCluster.svelte'
	import { loadDataset } from './loadDataset.js'

	let { key = 'ukelections2019', dataset: _dataset, userConfig = {} } = $props()
	// let { key = 'titanic', _dataset } = $props()
	// this is a placeholder for eventual saved configurations...
	//const { that } = $props()
	let dataset = $state()
	onMount(async () => {
		if (!_dataset) {
			loadDataset(key, userConfig).then((_dataset) => {
				console.log('Dataset: ', _dataset)
				dataset = _dataset
			})
		}
	})

	$effect(() => {
		console.log('Dataset: ', dataset)
	})
</script>

<AFrameScene stats={false} showEnvironment={false}>
	<!-- <DataContext {dataset}> -->
	<!-- {#snippet cluster(dataset)} -->
	{#if dataset !== undefined}
		<AFrameDataCluster {key} {dataset} />
	{/if}
	<!-- {/snippet} -->
	<!-- </DataContext> -->
</AFrameScene>
