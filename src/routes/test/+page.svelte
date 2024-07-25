<script>
	import AFrameScene from '@components/aframe/AFrameScene.svelte'
	import titanic from './titanic.json'

	const envPreset = 'forest'
	const environment = `preset: ${envPreset}; grid: cross`
	console.log('Titanic dataset: ', titanic)
</script>

<AFrameScene stats={false} {environment}></AFrameScene>
