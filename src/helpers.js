export const isIphoneX = () => {
  const dim = Dimensions.get('window');

  return (
    Platform.OS === 'ios' && ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  )
}