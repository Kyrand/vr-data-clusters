<script>
	import AFrameGui from '../AFrameGUI.svelte'
	import { onMount } from 'svelte'
	import cfg from '../config'
	export let position = '0 0 0'
	export let scale = '1'
	export let key = 'titanic'
	export let animate = false
	export let colorField = ''
	export let xField = '',
		yField = '',
		zField = '',
		groupField = ''

	let loaded = false
	onMount(() => (loaded = true))
	let GUIConfig = []

	function getValidFields(datum, ignoreFields = []) {
		let fields = []
		for (const [key, value] of Object.entries(datum)) {
			if (!ignoreFields.includes(key)) {
				fields.push(key)
			}
		}
		return fields
	}

	function setDefaults(key) {
		const defaults = cfg.datasets[key]
		;({ xField, yField, zField, colorField, groupField, animate } = defaults)
		GUIConfig = [{ label: 'x-field', name: 'xField', type: 'select', default: xField, options: [] }]
	}

	$: setDefaults(key)
	$: console.log('xField', xField)
</script>

{#if loaded}
	<a-entity
		class="data-cluster-wrapper"
		geometry="primitive: box;"
		material="visible:false"
		grabbable="true"
		{position}
		{scale}
		data-loader="dataset: {key}"
	>
		<a-entity
			class="data-cluster"
			rotation="0 0 0"
			axis=""
			data-cluster={`animate: ${animate};
                   dataset: ${key};
                   colorField: ${colorField};
                   xField: ${xField};
                   yField: ${yField};
                   zField: ${zField};
                   groupField: ${groupField}`}
			data-injector
		>
			<a-entity class="labels">
				<a-entity class="axes-labels" />
				<a-entity class="group-labels" />
			</a-entity>
		</a-entity>
	</a-entity>
{/if}
