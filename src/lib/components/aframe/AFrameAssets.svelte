<script>
	export let AFRAME = null

	// import dp from './data-cluster/data-particles/AF_dataParticles.js'
	// import 'aframe-template-component'
	//export let environment = 'egypt'
	// dp.register(AFRAME)
</script>

<!-- <svelte:head>
	<script
		src="https://unpkg.com/aframe-environment-component@1.3.2/dist/aframe-environment-component.min.js"
	></script>
</svelte:head> -->

<a-assets>
	<script id="data-cluster" type="text/x-nunjucks-template">
		;<a-entity
			template="src: templates/data-cluster.html; type:nunjucks"
			position="{{position}}"
		></a-entity>
	</script>
	<canvas id="canvas01" />
	<script>
	</script>
	<a-asset-item id="crucible" src="/assets/models/crucible/scene.gltf" />
	<a-asset-item id="titanic" src="/assets/models/titanic/scene.gltf" />
	<a-asset-item id="staff" src="/assets/models/staff/scene.gltf" />
	<a-asset-item id="wand" src="/assets/models/elders_wand.glb" />
	<a-asset-item
		id="test"
		src="https://cdn.aframe.io/test-models/models/glTF-2.0/virtualcity/VC.gltf"
	/>

	<!-- <a-mixin
		id="touch"
		physics-collider
		phase-shift
		collision-filter="collisionForces: false"
		static-body="shape: sphere; sphereRadius: 0.02"
		super-hands="colliderEvent: collisions;
          colliderEventProperty: els;
          colliderEndEvent: collisions;
          colliderEndEventProperty: clearedEls;"
	/> -->

	<img id="sky_sunset" src="/assets/textures/sky_sunset.jpg" />
	<img id="sky_italy" src="/assets/textures/sky_italy.jpg" />
	<img id="sky_smog" src="/assets/textures/sky_smog.jpg" />
	<img id="sky_urriellu" src="/assets/textures/sky_urriellu.jpg" />
	<img id="sky_ashFalls" src="/assets/textures/sky_ashFalls.jpg" />
	<img id="sky_marbleCanyon" src="/assets/textures/sky_marbleCanyon.jpg" />
	<img id="sky_houses" src="/assets/textures/sky_houses.jpg" />
	<img id="sky_morioka" src="/assets/textures/sky_morioka.jpg" />
	<img id="sky_yoplivia" src="/assets/textures/sky_yoplivia.jpg" />
</a-assets>
