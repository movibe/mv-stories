import React from 'react'
import {
  Animated,
  View,
  Platform,
  UIManager, 
  Dimensions,
  LayoutAnimation,
  StatusBar,
  PanResponder,
  Text,
} from 'react-native'

import styles from './styles'
import { Bubbles, Story } from './src/components'

const { width, height } = Dimensions.get('window')

export default class Stories extends React.Component {
  state = {
    carouselOpen: false,
    deckIdx: 0,
    offset: { top: height/2, left: width/2 },
    horizontalSwipe: new Animated.Value(0),
    indicatorAnim: new Animated.Value(0),
    paused: false,
    currentStory: null,
    swipedHorizontally: true,
    horizontalSwipe: new Animated.Value(0),
	  verticalSwipe: new Animated.Value(0),
	  backOpacity: 0,
    deckIdx: 0,
  }

  componentWillMount() {
		if (Platform.OS == 'android')
			UIManager.setLayoutAnimationEnabledExperimental(true)
		this.initPanResponder()
	}

  handlePress = async (idx, offset) => {
    await this.setState({ offset, deckIdx: idx })
    this.state.horizontalSwipe.setValue(idx * width)

		requestAnimationFrame(async () => {
			LayoutAnimation.easeInEaseOut()
      await this.setState({ carouselOpen: true })
      StatusBar.setHidden(true)
			this.animateIndicator()
		})
  }

  initPanResponder = () => {
    this.panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: (evt, { dx, dy }) => {
				if (Math.abs(dx) > 5) {
					this.setState({ swipedHorizontally: true })
					return true
				}

				if (dy > 5) {
					this.setState({ swipedHorizontally: false })
					return true
				}

				return false
			},

			onPanResponderGrant: () => {
				if (this.state.swipedHorizontally) {
					this.state.horizontalSwipe.setOffset(this.state.horizontalSwipe._value)
					this.state.horizontalSwipe.setValue(0)
				}

				this.pause()
				this.setBackOpacity(0)
			},

			onPanResponderMove: (e, { dx, dy }) => {
				if (this.state.swipedHorizontally) {
					this.state.horizontalSwipe.setValue(-dx)
				} else {
					this.state.verticalSwipe.setValue(dy)
				}
			},

			onPanResponderRelease: (e, { dx, dy }) => {
				if (!this.state.swipedHorizontally) {
					if (dy > VERTICAL_THRESHOLD) return this.leaveStories()
					this.play()
					return this.resetVerticalSwipe()
				}

				this.state.horizontalSwipe.flattenOffset()
				const deckIdx = this.state.deckIdx

				if (dx > HORIZONTAL_THRESHOLD) { // previous deck
					if (deckIdx == 0)
						return this.leaveStories()
					
					return this.animateDeck(width * (deckIdx - 1), true)
				}
				
				if (dx < -HORIZONTAL_THRESHOLD) { // -> next deck
					if (deckIdx == this.stories.length - 1)
						return this.leaveStories()

					return this.animateDeck(width * (deckIdx + 1), true)
				}

				this.play()
				return this.animateDeck(width * deckIdx)
			}
		})
  }

  setBackOpacity = (backOpacity) => {
		this.state.backOpacity = backOpacity
	}

  animateIndicator = (reset=true) => {
    if (reset) this.setIndicatorAnim(0)
		requestAnimationFrame(() => {
			Animated.timing(this.state.indicatorAnim, {
				toValue: 1,
				duration: 5000 * (1-this.state.indicatorAnim._value),
			}).start(({ finished }) => {
				if (finished) this.onNextItem()
			})
		})
  }

  setIndicatorAnim = (value) => {
    this.state.indicatorAnim.setValue(value)
  }

  getCurrentStory = async () => {
		if (this.props.stories.length <= 0) return null
    await this.setState({ currentStory: this.props.stories[this.state.deckIdx] })
    return this.state.currentStory
	}

  onNextItem = async () => {
    if (this.state.paused) return this.play()

		const story =  await this.getCurrentStory()
		console.log('story --------', story)

		if (story.idx >= story.items.length - 1)
			return this.onNextDeck()

		this.animateIndicator()
		this.setStoryIdx(story.idx + 1)
  }

  onPrevItem = async () => {
		if (this.backOpacity == 1) this.setBackOpacity(0);

		const story = await this.getCurrentStory()

		if (story.idx == 0)
			return this.onPrevDeck()

		this.animateIndicator();
		this.setStoryIdx(story.idx - 1)
	}

  onNextDeck = () => {
		if (this.state.deckIdx >= this.props.stories.length - 1) return this.leaveStories()
		this.animateDeck((this.state.deckIdx + 1)*width, true)
	}

  onPrevDeck = () => {
		if (this.state.deckIdx == 0) return this.leaveStories();
		this.animateDeck((this.state.deckIdx - 1)*width, true);
	}

  leaveStories = () => {
		if (this.state.swipedHorizontally) {
			this.animateDeck((width * this.state.deckIdx))
		} else {
			this.resetVerticalSwipe()
		}
		this.dismissCarousel()
	}

  animateDeck = (toValue, reset=false) => {
		if (reset) {
			this.setState({ deckIdx: parseInt(toValue / width) })
			this.animateIndicator()
		}
    
		Animated.spring(this.state.horizontalSwipe, {
			toValue, friction: 9
		}).start()
	}

  resetVerticalSwipe = () => {
		Animated.spring(this.state.verticalSwipe, { toValue: 0 }).start()
	}

  dismissCarousel = () => {
		LayoutAnimation.easeInEaseOut()
		this.setState({ carouselOpen: false })
    StatusBar.setHidden(false)
	}

  pause = () => {
		this.setState({ paused: true })
		this.state.indicatorAnim.stopAnimation()
	}

	play = () => {
		if (this.state.paused) {
			this.setState({ paused: false })
			this.animateIndicator(false)
		}
	}

  setStoryIdx = (idx) => {
    const currentStory = this.state.currentStory
    currentStory.idx = idx
    this.setState({ currentStory })
	}

  render() {
    const { offset, carouselOpen } = this.state
    const { stories } = this.props

    return (
      <View>
        <Bubbles stories={stories} onPress={this.handlePress} />

        <View style={[
					styles.carouselWrap,
					offset,
					(carouselOpen ? styles.open : styles.closed)
				]}>
					<View style={styles.container} >
            {stories.map((story, idx) => {
              let scale = this.state.verticalSwipe.interpolate({
                inputRange: [-1, 0, height],
                outputRange: [1, 1, 0.75]
              })
              
              if (this.state.swipedHorizontally) {
                scale = this.state.horizontalSwipe.interpolate({
                  inputRange: [width*(idx-1), width*idx, width*(idx+1)],
                  outputRange: [0.79, 1, 0.78]
                })
              }

              return (
                <Animated.View
                  key={idx}
                  style={[styles.deck, {
                    transform: [
                      {
                        translateX: this.state.horizontalSwipe.interpolate({
                          inputRange: [width*(idx-1), width*idx, width*(idx+1)],
                          outputRange: [width, 0, -width]
                        })
                      },
                      {
                        translateY: this.state.verticalSwipe.interpolate({
                          inputRange: [-1, 0, height],
                          outputRange: [0, 0, height/2]
                        })
                      },
                      { scale }
                    ]
                  }]
                }>
                  <Story 
										story={story} 
										currentDeck={this.state.deckIdx == idx}
										onNextItem={this.onNextItem}
										onPrevItem={this.onPrevItem}
										pause={this.pause}
										dismissCarousel={this.dismissCarousel}
										setBackOpacity={this.setBackOpacity}
										backOpacity={this.state.backOpacity}
										indicatorAnim={this.state.indicatorAnim}
									/>
                </Animated.View>
              )
            })}
          </View>
				</View>
      </View>
    )
  }
}