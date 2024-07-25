<script>
	import AFrameGui from '../AFrameGUI.svelte'
	import { getContext } from 'svelte'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import cfg from '@lib/aframe/config'
	import consts from '@lib/aframe/consts'
	import { getDataset } from '@lib/aframe/aframe-data-cluster/datasetStore'
	import { getAxesScales } from '@lib/aframe/aframe-data-cluster/process-dataset'
	import Axes from './AF_Axes_XYZ.svelte'
	import Labels from './AF_Labels.svelte'
	import AfLegend from './AF_Legend.svelte'
	import DatasetDetails from '../DatasetDetails.svelte'

	let {
		position = '0, 0, 0',
		scale = '1',
		key = '',
		dataset,
		test,
		dimensions = { x: 1, y: 1, z: 1 },
		padding = 0.1
	} = $props()
	let dcEl = $state({})

	let geoFlag = $derived(dataset.defaults.geoField ? true : false)

	let loaded = $state(false)
	let textLabels = writable([])
	textLabels.subscribe((v) => {
		console.log('Labels: ', v)
	})

	let JSONData = $state('{}')
	let HexJSONData = $state('{}')
	let JSONConfig = $state('{}')
	let axesScales = $state({ x: null, y: null, z: null })

	onMount(() => {
		loaded = true
		console.log('dcEl: ', dcEl)
	})

	function a2s(axis) {
		const { range, domain, padding, type } = axis
		return `range: ${range.join(',')}; domain: ${domain.join(',')}; padding: ${padding}; scale: ${type}`
	}

	$effect(() => {
		console.log('dcEL: ', dcEl.attributes)
		dcEl._textLabels = textLabels
		//dcEl._dataset = dataset
	})

	let hScale = scale / 2

	let GUIConfig = []
	const Values = (state = {}) => {
		let value = $state(state)
		return {
			get values() {
				return value
			},
			set values(_value) {
				value = _value
			}
		}
	}
	let GUIValues = $state({})

	let xField,
		yField,
		zField,
		colorField,
		colorFieldScheme,
		groupField,
		animate,
		cloudType,
		geoField,
		geoScale,
		jitterFactor
	function setDefaults({ fields, defaults }) {
		;({
			xField,
			yField,
			zField,
			colorField,
			colorFieldScheme,
			groupField,
			animate,
			cloudType,
			geoField,
			geoScale
		} = defaults)
		const _fields = fields.filter((f) => !f.startsWith('coords_'))
		const geoFields = fields.filter((f) => f.startsWith('coords_'))
		GUIConfig = [
			{
				label: 'Cloud type',
				name: 'cloudType',
				type: 'select',
				default: 'XYZ',
				options: Object.values(consts.CLOUD_TYPES)
			},
			{
				label: 'X-field',
				name: 'xField',
				type: 'select',
				default: xField,
				options: _fields
			},
			{
				label: 'Y-field',
				name: 'yField',
				type: 'select',
				default: yField,
				options: _fields
			},
			{
				label: 'Z-field',
				name: 'zField',
				type: 'select',
				default: zField,
				options: _fields
			},
			{
				label: 'Group-field',
				name: 'groupField',
				type: 'select',
				default: groupField,
				options: _fields
			}
		]
		// check for color options
		if (typeof colorFieldScheme !== 'object') {
			GUIConfig.push({
				label: 'Color-field',
				name: 'colorField',
				type: 'select',
				default: colorField,
				options: _fields
			})
			GUIConfig.push({
				label: 'Color-field color map',
				name: 'colorFieldScheme',
				type: 'select',
				default: colorFieldScheme,
				options: cfg.colorFieldSchemes
			})
		}
		// check for geo params
		if (geoField) {
			GUIConfig.push({
				label: 'Geo-field',
				name: 'geoField',
				type: 'select',
				default: geoField,
				options: geoFields
			})
			GUIConfig.push({
				label: 'Geo scale',
				name: 'geoScale',
				type: 'range',
				default: geoScale,
				min: 0.001,
				max: 0.05
			})
		}
		GUIValues = { ...defaults }
	}
	setDefaults(dataset)

	//let activeFields = $state([])

	let activeFields = $derived([
		...cfg.defaultGuiFields,
		...cfg.clouds[GUIValues.cloudType].guiFields
	])

	$effect(() => {
		// activeFields = [...cfg.defaultGuiFields, ...cfg.clouds[GUIValues.cloudType].guiFields]
		//activeFields = [...cfg.defaultGuiFields]
		console.log(
			// `Cloud-type: ${GUIValues.cloudType}, active-fields: ${JSON.stringify(activeFields)}`
			//`Active-fields: ${JSON.stringify(activeFields)}`
			`Active-fields: ${activeFields}`
		)
	})
	// 	//if (dataset !== undefined) setDefaults(key)
	// 	//console.log('Text labels: ', textLabels)
	// })
	//$: initData(dataset.value, dcEl)
	$inspect(key, `key: ${key}`)
	$inspect(test, `test string: ${test}`)
	$inspect(dataset, `Dataset: ${dataset}`)
	$effect(() => {
		//console.log('Dataset: ', dataset)
		console.log('GUIValues: ', GUIValues)
	})
	const setValue = ({ key, value }) => {
		console.log(`Setting ${key} to ${value}`)
		GUIValues[key] = value
	}
	const v2s = (o) => {
		return `${o.x} ${o.y} ${o.z}`
	}

	function injectDataset(node, { dataset }) {
		console.log('node: ', node, dataset)
		node._dataset = dataset
	}

	$effect(() => {
		// dataset.subscribe((ds) => {
		axesScales = getAxesScales({ ...GUIValues, ...dataset, dimensions, padding })
		//console.log('Updating axes scales: ', axesScales)
		// })
	})

	$effect(() => {
		// dataset.subscribe((ds) => {
		// setDefaults(ds)
		JSONData = JSON.stringify(dataset.data)
		HexJSONData = JSON.stringify(dataset.hexData)
		JSONConfig = JSON.stringify({ ...dataset, data: null })
		// console.log('JSON data: ', JSONData, JSONConfig)
		// })
	})
</script>

{#if loaded}
	<a-entity
		class="data-cluster-wrapper"
		geometry="primitive: box;"
		material="visible:false"
		grabbable="true"
		{position}
		{scale}
		_data-loader="dataset: {key}"
	>
		<a-entity
			bind:this={dcEl}
			class="data-cluster"
			rotation="0 0 0"
			data-cluster={`animate: ${GUIValues.animate};
                   key: ${key};
                   colorField: ${GUIValues.colorField};
                   colorFieldScheme: ${JSON.stringify(GUIValues.colorFieldScheme)};
                   xField: ${GUIValues.xField};
                   yField: ${GUIValues.yField};
                   zField: ${GUIValues.zField};
									 geoField: ${GUIValues.geoField};
									 geoScale: ${GUIValues.geoScale};
                   groupField: ${GUIValues.groupField};
									 cloudType: ${GUIValues.cloudType};
									 data: ${JSONData};
									 hexData: ${HexJSONData};
									 config: ${JSONConfig};`}
			_data-injector
		>
			<a-entity
				position={`0 0 -1`}
				visible={GUIValues.cloudType === 'Globe'}
				class="globe"
				scale={`${GUIValues.geoScale} ${GUIValues.geoScale} ${GUIValues.geoScale}`}
				globe="points-data: {JSON.stringify(
					[]
				)}; globe-image-url: /assets/images/earth-blue-marble.jpg"
			></a-entity>

			<a-entity class="labels">
				<Labels labels={$textLabels} />
				{#if GUIValues.cloudType === 'XYZ'}
					<Axes
						{axesScales}
						xField={GUIValues.xField}
						yField={GUIValues.yField}
						zField={GUIValues.zField}
						fieldData={dataset.fieldData}
						{scale}
					/>
				{/if}
			</a-entity>
		</a-entity>
		<AfLegend
			colorField={GUIValues.colorField}
			colorFieldScheme={GUIValues.colorFieldScheme}
			{dataset}
		/>
	</a-entity>

	<DatasetDetails {dataset} />
	<AFrameGui config={GUIConfig} values={GUIValues} {setValue} debug={true} {activeFields} />
{/if}

<style>
	:global(:root) {
		--background-color: #000;
	}
</style>
