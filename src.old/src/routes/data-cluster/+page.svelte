<!-- <svelte:head>
	<script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
</svelte:head> -->
<script>
	import { onMount } from 'svelte'
	import { json } from 'd3'

	import afu from '@lib/aframe/aframe-utils'
	//import store from './store'
	import cfg from '@lib/aframe/config'
	import DataContext from '@components/aframe/DataContext.svelte'
	import AFrameScene from '@components/aframe/AFrameScene.svelte'
	import AFrameDataCluster from '@components/aframe/data-cluster/AF_DataCluster.svelte'

	export let key = 'titanic'
	export let dataset
	//const { that } = $props()
	onMount(() => {
		if (!dataset) {
			loadDataset(key)
		}
	})

	function loadDataset(key) {
		console.log('Loading dataset: ' + key)
		json('assets/data/' + key + '.json').then((data) => {
			afu.log(data)
			// preliminary data processing
			//AFRAME.scenes[0].emit("setChartData", this.processData(data))
			let fields = Object.keys(data[0])
			let count = data.length
			let fieldData = cfg.datasets[key].fields
			data = processData(data, fieldData)
			dataset = { key, data, fieldData, fields, count }
			//store.setData({
			//	key: this.data.dataset,
			//	data: this.processData(data)
			//})
			// now set things rolling
			//this.initCluster()
			// add a little interaction
			//gui(this)
		})
	}

	function processData(data, fieldData = {}) {
		let fields = Object.keys(data[0])
		let count = data.length
		//this.clusterData = clusterData
		data.forEach((d, i) => {
			d._index = i
			fields.forEach((f) => {
				if (fieldData[f]) {
					// process by type...
				} else {
					if (d[f] !== undefined && d[f] !== null) d[f] = d[f].toString()
					else d[f] = null
				}
			})
		})
		return data
	}
</script>

<AFrameScene stats={false} showEnvironment={false}>
	<DataContext {dataset}>
		<AFrameDataCluster {key} />
	</DataContext>
</AFrameScene>
