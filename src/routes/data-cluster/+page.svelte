<!-- <svelte:head>
	<script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
</svelte:head> -->
<script>
	import { onMount } from 'svelte'
	import { json, extent } from 'd3'

	import afu from '@lib/aframe/aframe-utils'
	//import store from './store'
	import cfg from '@lib/aframe/config'
	import consts from '@lib/aframe/consts'
	import DataContext from '@components/aframe/DataContext.svelte'
	import AFrameScene from '@components/aframe/AFrameScene.svelte'
	import AFrameDataCluster from '@components/aframe/data-cluster/AF_DataCluster.svelte'
	import { addDataset } from '@lib/aframe/aframe-data-cluster/datasetStore.js'

	//export let key = 'titanic'
	//export let dataset
	let { key = 'ukelections2019', _dataset } = $props()
	// let { key = 'titanic', _dataset } = $props()
	// this is a placeholder for eventual saved configurations...
	let userConfig = {}
	//const { that } = $props()
	onMount(() => {
		if (!_dataset) {
			loadDataset(key)
		}
	})

	let dataset = $state()
	function loadDataset(key) {
		console.log('Loading dataset: ' + key)
		const config = cfg.datasets[key]
		const promises = [json('assets/data/' + key + '.json')]
		if (config.hexMap) {
			promises.push(json(`assets/data/${config.hexMap}.hexjson`))
		}
		Promise.all(promises).then((_data) => {
			let data = _data[0]
			const hexData = config.hexMap ? _data[1] : []
			// preliminary data processing
			//AFRAME.scenes[0].emit("setChartData", this.processData(data))
			let datum = data[0]
			let fields = getValidFields(datum, config.ignoreFields)
			let fieldData = {}
			fields.forEach((field) => {
				fieldData[field] = processField(field, data, config.fields[field])
			})
			console.log('Field data: ', fieldData)
			// fieldData = { ...fieldData, ...config.fields }
			let count = data.length

			data = processData(data, fieldData)
			dataset = {
				key,
				data,
				fieldData,
				fields,
				count,
				defaults: { ...config.defaults, ...userConfig },
				config,
				hexData
			}

			const _dataset = addDataset(dataset)
			function processField(field, data, _field = {}) {
				const type = guessFieldType(field, data)
				let domain
				switch (type) {
					case consts.FIELD_TYPES.Categorical:
						domain = [...new Set(data.map((d) => d[field]))].sort()
						break
					case consts.FIELD_TYPES.Numerical:
						domain = extent(data.map((d) => d[field]))
						break
					default:
						console.log(`Field ${field} has type ${type} and no domain`)
				}
				return { domain, type, ..._field }
			}

			function guessFieldType(field, data) {
				let s = new Set(data.slice(0, 500).map((d) => d[field]))
				if (s.size < 30) return consts.FIELD_TYPES.Categorical
				// numerical?
				if (data.slice(0, 50).every((d) => d === null || !isNaN(Number(d[field])))) {
					return consts.FIELD_TYPES.Numerical
				}
			}
		})
	}

	function getValidFields(datum, ignoreFields = []) {
		let fields = []
		for (const [key, value] of Object.entries(datum)) {
			if (!ignoreFields.includes(key)) {
				fields.push(key)
			}
		}
		return fields
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
