import React, { useState, useEffect, useContext } from 'react'
import { Text, View, UIManager, LayoutAnimation, Platform } from 'react-native'
import uuid from 'react-native-uuid'

import DefaultMessageComponent from './DefaultMessageComponent'
import DefaultMessageComponentAnimated from './DefaultMessageComponentAnimated'
import DefaultMessageComponentFade from './DefaultMessageComponentFade'
import DefaultTextMessageComponentFade from './DefaultTextMessageComponentFade'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

const MessageContext = React.createContext({
  messageList: {},
  globalAnimationEnabled: false,
  messageReady: false,
  messageInterface: {
    show: (options, namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    remove: (id, namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    forceRemove: (id, namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    removeAll: (namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    forceRemoveAll: (namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    update: (id, options, namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    triggleGlobalAnimation: (enabled) => {
      console.warn('MessageProvider not ready')
      return null
    },
  },
})

const useMessage = () => {
  const context = useContext(MessageContext)
  const messageList = context.messageList
  const globalAnimationEnabled = context.globalAnimationEnabled
  const messageInterface = context.messageInterface
  const messageReady = context.messageReady

  return { messageList, globalAnimationEnabled, messageInterface, messageReady }
}

const withMessage = (Component) => (props) => {
  const { messageList, globalAnimationEnabled, messageInterface } = useMessage()
  return (
    <Component
      {...props}
      messageList={messageList}
      globalAnimationEnabled={globalAnimationEnabled}
      messageInterface={messageInterface}
    />
  )
}

const buildinComponents = {
  DefaultMessageComponent,
  DefaultMessageComponentAnimated,
  DefaultMessageComponentFade,
  DefaultTextMessageComponentFade,
}

const MessageContainer = (props) => {
  const { messageList, messageInterface } = useMessage()

  useEffect(() => {}, [messageList])

  const style = props.style || {}
  const messageComponentStyle = props.messageComponentStyle || {}
  const MessageComponent = props.messageComponent || DefaultTextMessageComponentFade
  const namespace = props.namespace || 'default'
  const maxMessage = props.maxMessage || 0
  const orderInverse = props.orderInverse || false

  const preNamespace = messageList[namespace] || []

  const renderObject = () => {
    let children = preNamespace.map((options, index) => (
      <MessageComponent
        key={options.id}
        style={[
          messageComponentStyle,
          maxMessage ? (index >= maxMessage ? { display: 'none' } : {}) : {},
        ]}
        message={options}
      />
    ))
    if (orderInverse) children.reverse()

    return children
  }

  return (
    <View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        style,
      ]}
      pointerEvents='box-none'>
      {renderObject()}
    </View>
  )
}

const MessageProvider = ({ children, globalAnimation }) => {
  const [messageList, setMessageList] = useState({})
  const globalAnimation_ = globalAnimation === undefined ? false : globalAnimation
  const [globalAnimationEnabled, setGlobalAnimationEnabled] = useState(globalAnimation_)
  const [messageReady, setMessageReady] = useState(false)

  const [messageInterface, setMessageInterface] = useState({
    show: (options, namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    remove: (id, namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    forceRemove: (id, namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    removeAll: (namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    forceRemoveAll: (namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    update: (id, options, namespace) => {
      console.warn('MessageProvider not ready')
      return null
    },
    triggleGlobalAnimation: (enabled) => {
      console.warn('MessageProvider not ready')
      return null
    },
  })

  const setAnimation = () => {
    LayoutAnimation.configureNext({
      create: { type: 'linear', property: 'opacity', duration: 300 },
      update: { type: 'spring', springDamping: 0.4, duration: 500 },
      delete: { type: 'linear', property: 'opacity', duration: 300 },
    })
  }

  const messageInterfaceShow = (options, namespace) => {
    const id = uuid.v4()
    const namespace_ = namespace || 'default'

    if (globalAnimationEnabled) setAnimation()

    setMessageList((preMessageList) => {
      let preNamespace = preMessageList[namespace_] || []

      return {
        ...preMessageList,
        [namespace_]: [
          { ...options, removed: true, id: id, namespace: namespace_ },
          ...preNamespace,
        ],
      }
    })
    return id
  }

  const messageInterfaceRemove = (id, namespace) => {
    messageInterfaceUpdate(id, { removed: false }, namespace)
  }

  const messageInterfaceForceRemove = (id, namespace) => {
    const id_ = id
    const namespace_ = namespace || 'default'

    if (globalAnimationEnabled) setAnimation()

    setMessageList((preMessageList) => {
      let preNamespace = preMessageList[namespace_]
      if (!preNamespace) return preMessageList

      return {
        ...preMessageList,
        [namespace_]: preNamespace.filter((el) => el.id !== id_),
      }
    })
  }

  const messageInterfaceRemoveAll = (namespace) => {
    const namespace_ = namespace || 'default'

    setMessageList((preMessageList) => {
      let preNamespace = preMessageList[namespace_]
      if (!preNamespace) return preMessageList

      return {
        ...preMessageList,
        [namespace_]: preNamespace.map((el) => ({ ...el, removed: false })),
      }
    })
  }

  const messageInterfaceForceRemoveAll = (namespace) => {
    const namespace_ = namespace || 'default'

    if (globalAnimationEnabled) setAnimation()

    setMessageList((preMessageList) => {
      let preNamespace = preMessageList[namespace_]
      if (!preNamespace) return preMessageList

      return {
        ...preMessageList,
        [namespace_]: [],
      }
    })
  }

  const messageInterfaceUpdate = (id, options, namespace) => {
    const id_ = id
    const namespace_ = namespace || 'default'

    setMessageList((preMessageList) => {
      let preNamespace = preMessageList[namespace_]
      if (!preNamespace) return preMessageList

      return {
        ...preMessageList,
        [namespace_]: preNamespace.map((el) =>
          el.id == id_ ? { ...el, ...options, id: id_, namespace: namespace_ } : el,
        ),
      }
    })

    return id_
  }

  const triggleGlobalAnimation = (enabled) => {
    if (enabled === undefined) setGlobalAnimationEnabled(!globalAnimationEnabled)
    else setGlobalAnimationEnabled(enabled)

    return enabled === undefined ? !globalAnimationEnabled : enabled
  }

  useEffect(() => {
    setMessageInterface({
      show: messageInterfaceShow,
      remove: messageInterfaceRemove,
      forceRemove: messageInterfaceForceRemove,
      removeAll: messageInterfaceRemoveAll,
      forceRemoveAll: messageInterfaceForceRemoveAll,
      update: messageInterfaceUpdate,
      triggleGlobalAnimation: triggleGlobalAnimation,
    })
    setMessageReady(true)
  }, [globalAnimationEnabled])

  return (
    <MessageContext.Provider
      value={{
        messageList: messageList,
        messageInterface: messageInterface,
        globalAnimationEnabled: globalAnimationEnabled,
        messageReady: messageReady,
      }}>
      {children}
    </MessageContext.Provider>
  )
}

export {
  useMessage,
  MessageProvider,
  MessageContainer,
  MessageContext,
  withMessage,
  buildinComponents,
}
