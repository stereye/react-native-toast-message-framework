import React, { useState, useEffect, useContext, useRef } from 'react'
import { Text, Animated } from 'react-native'

import { useMessage } from './message'

const DefaultMessageComponentAnimated = ({ style, message }) => {
  const { messageInterface } = useMessage()
  const moveAnim = useRef(new Animated.Value(0)).current

  const removed = message.removed

  useEffect(() => {
    // handle message.duration
    let timeoutID = 0
    if (message.duration)
      timeoutID = setTimeout(
        () => messageInterface.remove(message.id, message.namespace),
        message.duration,
      )

    // startup animation
    Animated.timing(moveAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start()

    return () => {
      clearTimeout(timeoutID)
    }
  }, [])

  // handle message.removed
  useEffect(() => {
    // disappear animation
    if (!removed)
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start((finished) => messageInterface.forceRemove(message.id, message.namespace))
  }, [removed])

  // In this example, we make two animations:
  // 1. the height will grow up
  // 2. then the message panel slide in from the left

  const placeholderHeight = moveAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  })

  const leftMargin = moveAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: ['-100%', '-100%', '0%'],
  })

  return (
    <Animated.View
      style={[
        {
          flex: 0,
          marginVertical: Animated.multiply(placeholderHeight, style.marginVertical || 0),
          marginTop: Animated.multiply(placeholderHeight, style.marginTop || 0),
          marginBottom: Animated.multiply(placeholderHeight, style.marginBottom || 12),
          height: Animated.multiply(placeholderHeight, style.height || 35),
          paddingHorizontal: 12,
          marginLeft: leftMargin,
          width: 300,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 4,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          overflow: 'hidden',
        },
        style,
      ]}>
      <Text>{message.message}</Text>
    </Animated.View>
  )
}

export default DefaultMessageComponentAnimated
