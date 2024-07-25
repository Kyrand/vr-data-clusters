export function dragMe(node) {
	let moving = false
	let left = 300
	let top = 100

	node.style.position = 'absolute'
	node.style.top = `${top}px`
	node.style.left = `${left}px`
	node.style.cursor = 'move'
	node.style.userSelect = 'none'

	node.addEventListener('mousedown', () => {
		moving = true
	})

	window.addEventListener('mousemove', (e) => {
		if (moving) {
			left += e.movementX
			top += e.movementY
			node.style.top = `${top}px`
			node.style.left = `${left}px`
		}
	})

	window.addEventListener('mouseup', () => {
		moving = false
	})
}
