<script>
	export let hand = 'left'
	export let handModelStyle = 'lowPoly'
	export let handColor = '#ffcccc'
	export let device = 'oculus'
	export let strength = 1

	$: getAttrs = () => {
		if (device === 'oculus') {
			return {
				'oculus-touch-controls': `hand: ${hand}; handModelStyle: ${handModelStyle}; color: ${handColor}`
			}
		}
	}
</script>

<a-entity
	data-whip={`strength: ${strength}`}
	id={hand + '-hand-control'}
	mixin="touch"
	_teleport-controls="cameraRig: #cameraRig"
	_datgui
	_laser-controls
	cursor
	raycaster="showLine: true; lineOpacity: 0.5; objects: [html];"
	{...getAttrs()}
>
	<!-- <a-entity gltf-model={'#staff'} position="0 0 -0.63" scale="0.5 0.5 0.5" /> -->
	<!-- <a-entity laser-controls={'hand:' + hand} /> -->
</a-entity>
