import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
import { isIphoneX } from '../../helpers'

export default StyleSheet.create({
	deck: {
		width, 
		height,
		backgroundColor: 'white',
		flexDirection: 'row',
	},
	progressIndicator: {
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},

	indicatorWrap: {
		position: 'absolute',
		top: 0, left: 0, right: 0,
	},
	indicators: {
		height: 10,
		alignItems: 'center',
		paddingHorizontal: 8,
		flexDirection: 'row',
		paddingTop: 20,
	},
	indicatorBg: {
		position: 'absolute',
		top: 0, left: 0, right: 0,
		height: 50,
	},

	back: {
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		width: 90,
	},

	closeButton: {
		position: 'absolute',
		right: 0,
		width: 70,
		height: 70,
		zIndex: 1,
		alignSelf: 'flex-end',
	},
	closeCross: {
		position: 'absolute',
		top: 32, right: 8,
		width: 20,
		height: 1,
		backgroundColor: '#fff'
	},
	storyAction: {
		flex: 1,
	},
})