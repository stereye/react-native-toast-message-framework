import React, { useState, useEffect, useContext, useRef } from 'react'
import { Text, Animated, Easing } from 'react-native'

import { useMessage } from './message'

const DefaultTextMessageComponentFade = ({ style, message }) => {
  const { messageInterface } = useMessage()
  const fadeAnim = useRef(new Animated.Value(0)).current

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
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start()

    return () => {
      clearTimeout(timeoutID)
    }
  }, [])

  // handle message.removed
  useEffect(() => {
    // disappear animation
    if (!removed)
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start((finished) => messageInterface.forceRemove(message.id, message.namespace))
  }, [removed])

  const opacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  return (
    <Animated.Text
      style={[
        {
          flex: 0,
          marginBottom: 12,
          height: 35,
          paddingHorizontal: 12,
          width: 300,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 4,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          overflow: 'hidden',
          opacity: opacity,
        },
        style,
      ]}>
      {message.message}
    </Animated.Text>
  )
}

export default DefaultTextMessageComponentFade
