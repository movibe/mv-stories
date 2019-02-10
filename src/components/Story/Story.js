import React from 'react'
import { View, Dimensions, TouchableWithoutFeedback, Text, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native'
import { Indicator } from '../'
import Image from 'react-native-image-progress'
// import CircleSnail from 'react-native-progress/CircleSnail'

import styles from './styles'

// const circleSnailProps = { thickness: 1, color: '#ddd', size: 80 }
const { width, height } = Dimensions.get('window')

export default class Story extends React.Component {
	render() {
		const { story, onNextItem, pause, onPrevItem } = this.props
		
		return (
			<ImageBackground source={{ uri: story.items[story.idx].src }} style={styles.deck}>
				<TouchableOpacity
					onPress={onPrevItem}
					delayPressIn={200}
					onPressIn={pause}
					style={styles.storyAction}
				/>
				<TouchableOpacity
					onPress={onNextItem}
					delayPressIn={200}
					onPressIn={pause}
					style={styles.storyAction}
				/>
				{this.renderIndicators()}
			</ImageBackground>
		)
	}

	renderCloseButton() {
		return (
			<TouchableWithoutFeedback onPress={this.props.dismissCarousel}>
				<View style={styles.closeButton}>
					<View style={[styles.closeCross, { transform: [{rotate: '45deg'}]}]} />
					<View style={[styles.closeCross, { transform: [{rotate: '-45deg'}]}]} />
				</View>
			</TouchableWithoutFeedback>
		)
	}

	renderIndicators() {
		const { story, currentDeck, indicatorAnim } = this.props

		return (
			<SafeAreaView style={styles.indicatorWrap}>
				<View style={styles.indicators}>
					{story.items.map((item, i) => (
						<Indicator
							key={i}
							i={i}
							animate={currentDeck && story.idx == i}
							story={story}
							indicatorAnim={indicatorAnim}
						/>
					))}
				</View>
				{this.renderCloseButton()}
			</SafeAreaView>
		)
	}
}

// <Components.LinearGradient
// 					colors={['rgba(0,0,0,0.33)', 'transparent']}
// 					locations={[0, 0.95]}
// 					style={styles.indicatorBg}
// 				/>

// <Components.LinearGradient
// 					colors={['rgba(0,0,0,0.33)', 'transparent']}
// 					locations={[0, 0.85]}
// 					start={[0, 0]}
// 					end={[1, 0]}
// 					style={[styles.back, {
// 						opacity: backOpacity
// 					}]}
// 				/>