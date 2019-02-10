import React from 'react'
import { ScrollView, View, TouchableWithoutFeedback, Image } from 'react-native'

import styles from './styles'

const bubbleSize = 70

export default class Bubbles extends React.Component {
  render() {
    const { stories, onPress } = this.props

    return (
      <ScrollView
        style={styles.bubbles}
        contentContainerStyle={{ alignItems: 'center' }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {stories.map((story, i) => (
          <View ref={`_${i}`} key={i}>
            <TouchableWithoutFeedback
              activeOpacity={0.9}
              onPress={() => {
                this.refs[`_${i}`].measure((ox, oy, width, height, px, py) => {
                  const offset = {
                    top: (py + bubbleSize/2),
                    left: (px + bubbleSize/2)
                  };

                  onPress(i, offset)
                  // store.openCarousel(i, offset);
                });
              }}
            >
              <Image style={styles.img} source={{ uri: story.avatar }} />
            </TouchableWithoutFeedback>
          </View>
        ))}
      </ScrollView>
    )
  }
} 
