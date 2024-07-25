<!-- <svelte:head>
	<script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
</svelte:head> -->
<script>
	import AFrameScene from '@components/aframe/AFrameScene.svelte'
	import AFrameBoids from '@components/aframe/data-cluster/AFrameBoids.svelte'
</script>

<AFrameScene stats={false}>
	<AFrameBoids />
</AFrameScene>
