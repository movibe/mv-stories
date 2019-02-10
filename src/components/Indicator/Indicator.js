import React from 'react'
import { View, Animated } from 'react-native'

import styles from './styles'

export default class Indicator extends React.Component {
	state = {
    width: 0,
  }

	setWidthFromLayout(event) {
		const { width } = event.nativeEvent.layout
		this.setState({ width })
	}

	render() {
		const { animate, story, i, indicatorAnim } = this.props
		let style = {}

		if (animate) {
			style = {
				width: indicatorAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [0, this.state.width],
					extrapolate: 'clamp'
				})
			}
		} else if (story.idx > i) { // seen
			style = { flex: 1 }
		} else if (story.idx <= i) { // coming
			style = { width: 0 }
		}

		return (
			<View style={styles.line} onLayout={this.setWidthFromLayout.bind(this)}>
				<Animated.View style={[styles.progress, style]} />
			</View>
		)
	}
}
