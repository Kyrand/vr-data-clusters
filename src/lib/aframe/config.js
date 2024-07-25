import { schemeObservable10 } from 'd3'
import consts from './consts'

const { CLOUD_TYPES: CT } = consts

export default {
	defaultGuiFields: ['cloudType', 'colorField', 'colorFieldScheme'],
	clouds: {
		[CT.Bar]: { guiFields: ['groupField'] },
		[CT.XYZ]: { guiFields: ['xField', 'yField', 'zField'] },
		[CT.Cloud]: { guiFields: [] },
		[CT.Globe]: { guiFields: ['geoField', 'geoScale'] },
		[CT.HexMap]: { guiFields: [''] },
		[CT.RadialCluster]: { guiFields: ['groupField'] }
	},
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
		radius: 0.015,
		padding: 0.001
	},
	defaultGeom: 'sphere',
	animationTime: 1000,
	colorFieldScheme: 'schemeAccent',
	colorFieldSchemes: ['schemeAccent', 'schemeCategory10', 'schemeDark2', 'schemeObservable10'],
	datasets: {
		titanic: {
			key: 'titanic',
			title: 'Titanic passenger dataset',
			intro:
				'This dataset is based on the passenger list of the HMS Titanic, which sunk on her maiden voyage in 1912 with the loss of 1,496 of the 2,224 passengers and crew. Survival was correlated with sex and passenger class and other recorded variables.',
			img: 'titanic.jpg',
			fields: {
				age: { type: consts.FIELD_TYPES.Numerical },
				fare: { type: consts.FIELD_TYPES.Numerical },
				pclass: { type: consts.FIELD_TYPES.Categorical, label: 'passenger class' },
				coords_embarked: { type: consts.FIELD_TYPES.Geographical }
			},
			ignoreFields: ['name', 'cabin', 'ticket', 'body', 'home.dest'],
			defaults: {
				xField: 'sex',
				yField: 'pclass',
				zField: 'survived',
				groupField: 'pclass',
				geoField: 'coords_embarked',
				geoScale: 0.005,
				colorField: 'sex',
				colorFieldScheme: 'schemeAccent',
				cloudType: consts.CLOUD_TYPES.XYZ,
				animate: 'true',
				jitterFactor: 0.1
			}
		},
		ukelections2019: {
			key: 'ukelections2019',
			title: 'UK General Election 2019',
			intro:
				"This visualisation uses data from the UK's 2019 general election</br> showing distribution of seats geographically and in aggregate",
			img: 'ukelections2019.png',
			fields: {},
			ignoreFields: ['invalid'],
			defaults: {
				xField: 'elected_mp_party',
				yField: 'ge17_party',
				zField: 'turnout_pct',
				groupField: 'elected_mp_party',
				geoField: null,
				geoScale: 0.005,
				colorField: 'elected_mp_party',
				//colorFieldScheme: 'schemeAccent',
				colorFieldScheme: {
					field: 'elected_mp_party',
					map: {
						Con: '#1689D9',
						Lab: '#da2728',
						LD: '#f8a531',
						Green: '#6cae30',
						SNP: '#fbdb32',
						DUP: '#d26a50'
					},
					default: '#ccc'
				},
				cloudType: consts.CLOUD_TYPES.XYZ,
				animate: 'true',
				jitterFactor: 0.1
			},
			hexMap: 'ukelections2019'
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
