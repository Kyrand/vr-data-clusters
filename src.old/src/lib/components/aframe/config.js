import consts from './consts'

export default {
	camera: {
		rot: { x: 0, y: 0, z: 0 },
		pos: { x: 0, y: 1, z: 0.0 }
	},
	cluster: {
		pos: { x: 0, y: 1, z: -0.5 },
		range: [-0.25, 0.25],
		padding: 0.1,
		materialOpacity: 0.1
	},
	crucible: {
		pos: { x: -0.2, y: -3.26, z: -0.61 },
		scale: { x: 0.25, y: 0.25, z: 0.25 }
	},
	dataWall: {
		pos: { x: 0, y: 1.5, z: -3 },
		width: 3.0,
		height: 3.0
	},
	maxNumPoints: 200,
	box: {
		width: 0.1,
		height: 0.1,
		depth: 0.1
	},
	sphere: {
		radius: 0.01,
		padding: 0.001
	},
	defaultGeom: 'sphere',
	animationTime: 1000,
	colorFieldScheme: 'schemeAccent',
	datasets: {
		titanic: {
			fields: {
				age: { type: consts.FIELD_TYPES.Numerical },
				fare: { type: consts.FIELD_TYPES.Numerical }
			},
			ignoreFields: ['name', 'cabin', 'ticket', 'body', 'home.dest'],
			key: 'titanic',
			title: 'Titanic passenger dataset',
			xField: 'age',
			yField: 'pclass',
			zField: 'survived',
			groupField: 'pclass',
			colorField: 'sex',
			animate: 'true'
		}
	},
	components: {
		'data-cluster': {
			position: '0 0 0',
			scale: '0.5 0.5 0.5'
		},
		dataset: {
			position: '0 0 0',
			scale: '0.1 0.1 0.1',
			key: 'titanic'
		},
		'data-crucible': {
			position: '0 0.25 0',
			scale: '0.5 0.5 0.5'
		},
		'data-chart': {
			type: 'bar'
		}
	}
}
