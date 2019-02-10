import { StyleSheet } from 'react-native'

const bubbleSize = 70;

export default StyleSheet.create({
	bubbles: {
		height: 90,
		flexDirection: 'row',
		paddingHorizontal: 5,
		overflow: 'visible',
	},
	img: {
		borderWidth: 2,
		borderColor: '#fff',
		width: bubbleSize,
		height: bubbleSize,
		borderRadius: bubbleSize/2,
		marginHorizontal: 6,
	},
})