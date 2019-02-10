import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  carouselWrap: {
		overflow: 'hidden',
		position: 'absolute',
	},
	closed: {
		width: 0,
		height: 0,
	},
	open: {
		width, height,
		top: 0,
		left: 0,
	},

  container: {
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.9)',
	},
	deck: {
		position: 'absolute',
		width, height,
		top: 0, left: 0,
	},
})