import React, { useState, useEffect, useContext } from 'react'
import { Text } from 'react-native'

import { useMessage } from './message'

const DefaultMessageComponent = ({ style, message }) => {
  const { messageInterface } = useMessage()

  const removed = message.removed

  // handle message.duration
  useEffect(() => {
    let timeoutID = 0
    if (message.duration)
      timeoutID = setTimeout(
        () => messageInterface.remove(message.id, message.namespace),
        message.duration,
      )

    return () => clearTimeout(timeoutID)
  }, [])

  // handle message.removed
  // here we won't do anything more.
  useEffect(() => {
    if (!removed) messageInterface.forceRemove(message.id, message.namespace)
  }, [removed])

  return (
    <Text
      style={[
        {
          flex: 0,
          paddingVertical: 8,
          paddingHorizontal: 6,
          width: 300,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 4,
          marginBottom: 12,
          textAlign: 'center',
        },
        style,
      ]}>
      {message.message}
    </Text>
  )
}

export default DefaultMessageComponent
