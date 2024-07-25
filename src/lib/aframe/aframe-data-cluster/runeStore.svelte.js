import { getContext, hasContext, setContext } from 'svelte'

export const rune = (_dataset, context = 'data-cluster') => {
	if (hasContext(context)) {
		return getContext(context)
	}
	console.log(`Setting context ${context} with dataset ${_dataset.key}`)
	let _state = $state(_dataset)
	const _rune = {
		get value() {
			return _state
		},
		set value(v) {
			_state = v
		}
	}
	setContext(context, _rune)
	return _rune
}
