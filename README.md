# React Native Toast Message Framework

Simply but easy to extended toast frame, written in pure JavaScript. It can used on both iOS and Android.

## Features

- Pure JS implementation
- Supports multiple toasts with multiple namespaces
- Supports multiple queue, you can put it on any edges or corners
- iOS and Android compatible
- Easy to difine your own style using pure React style way
- Easy to difine your own animation using pure React Native way: both Animated and LauoutAnimation are suppoted
- Easy to difine your own message component to extend the functionality
- Written using React Hooks, together with helper functions to work on Class components.
- Simply and easy template for you to extend.

## Installation

TBD
not in npm now.

## Basic Usage

As the The three most basic interface provided by `message` is `{ useMessage, MessageProvider, MessageContainer }`:

1. `MessageProvider` is the provider component, which hold the context and all API should work inside it. Typically you need to use it at the most top level.
2. `MessageContainer` is the container where your toast message will show. It localed on the center of the top by default.
3. `useMessage` provide interface hook which you can control the meesage, If you dislike the hook, we also provide `MessageContext` object and `withMessage` helper function.

### Example

```jsx
import { Button } from 'react-native'
import { useMessage, MessageProvider, MessageContainer } from 'message'

const App = () => {
  // useMessage to get the API interface,
  const { messageInterface } = useMessage()

  return (
    <Button
      onPress={() => {

        // add a new message
        messageInterface.show({
          message: 'Hello world!',  // set the message text,
          duration: 3000,           // disappear after 3000 milliseconds,
        })

      }}>
      Send a message
    </Button>
  )
}

return (
  {/* Provider component who holds the context */}
  <MessageProvider>
    {/* Container component where the message will appear */}
    <MessageContainer />
    <App />
  </MessageProvider>
)
```

## Advanced Usage

### Introduce of the structure

In this framework, we defined three kinds of components:

1. MessageProvider: who holds the context, (using react's context api). All other components should be put under it.
2. MessageContainer: the container which show the messages.

- You can add multiple MessageContainer with different namespace. Each namespace will holds its own message queue.
- This is useful if you need one message queue for global message and another queue at right top corner (like macOS style). especially when screen is landscape.

3. MessageComponent: the component who process the message options and control the appearance and animation of it. You can write your own message component and activate it as props of MessageContainer.

### Multiple messages queues / namespaces

### Control the message (show/hide/update)

### Animation

### Write your own message component

## Components

### MessageProvider Component

`import { MessageProvider } from 'message'`

Component who holds the context. All other components should be put under it.

| Prop                  | Type    | Required | Description                     | Default |
| --------------------- | ------- | -------- | ------------------------------- | ------- |
| **`globalAnimation`** | boolean | no       | Enable LayoutAnimation globally | false   |

### MessageContainer Component

`import { MessageContainer } from 'message'`

The container which show the messages.

| Prop                        | Type    | Required | Description                           | Default                         |
| --------------------------- | ------- | -------- | ------------------------------------- | ------------------------------- |
| **`namespace`**             | string  | no       | Namespace of this container holds     | 'default'                       |
| **`maxMessage`**            | number  | no       | maximum message size, 0 for unlimited | 0                               |
| **`orderInverse`**          | boolean | no       | Wether to inverse the order           | false                           |
| **`style`**                 | object  | no       | Style to the container component      | {}                              |
| **`messageComponentStyle`** | object  | no       | Style passed to the message component | {}                              |
| **`MessageComponent`**      | object  | no       | User definde message component        | DefaultTextMessageComponentFade |

By default, the container component will put all messages at the top center, you can override this by setting prop `style`.

```javascript
Default style:
{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: 12,
  zIndex: 99,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
}
```

### Message Component Interface

Defining your own message component gives you full control over the message handling. You can define your own properties, design animations and change the style as you like.

A Message Component should follow these rules:

1. `messageComponentStyle` will be passed to `props.style` by MessageContainer Component
2. The readonly original message options will be passed to `props.message`
3. Please be clear that `id`, `removed`, `namespace` is reserved options, see _MessageOptions_
4. By default, rather than deleting a message directly, the system will set its `removed` property to `true`. It's your responsibility to check this and prepare your disappear animations and other work. Make sure to call `messageInterface.forceRemove` after everything done.

The buildin component is good template for you to start with, refer to _Buildin Template Message Components_ to learn more.

## API Interface

### Get the API interface

We provide three ways to get access to the API interface: the hook, helper function, and context object.

#### useMessage Hook

`import { MessageContainer } from 'message'`

`const { messageList, globalAnimationEnabled, messageInterface } = useMessage()`

Nothing special but a pure react hook function.

#### withMessage Helper Function

`import { withMessage } from 'message'`

`const MessageApp = withMessage(MessageApp_)`

Adding `messageList`, `globalAnimationEnabled` and `messageInterface` as props to the Component. It's useful if you write class-styled component.

#### MessageContext

The low level context object created by `React.createContext`. Read the react docs to learn more about how to use it.

```
import { MessageContext } from 'message'

const YourComponent = ({}) => {
  const context = useContext(MessageContext)
  const messageList = context.messageList
  const globalAnimationEnabled = context.globalAnimationEnabled
  const messageInterface = context.messageInterface

  ...

  return (...)
}
```

### messageList

An object which holds all messages by the key of the namespace.

### globalAnimationEnabled

A boolean indices wether globalAnimation is enabled.

See _messageInterface.triggleGlobalAnimation_ to enable or disable it.

### messageInterface.show

`show(options, namespace): id`

Add a new message into the given namespace.

- `options`: MessageOptions, see `MessageOptions`
- `namespace`: (optional) string, the namespace the message to be added, (default: 'default')
- **returns**:
- id: string, the internal id of this message.

### messageInterface.remove

`remove(id, namespace): null`

Remove a message by given id and namespace.

- `id`: string, the internal id of this message
- `namespace`: (optional) string, the namespace of the message, (default: 'default')
- **returns**:
- null

Won't throw any exception if the given message is not found.

This function will internally update the message as `{removed: false}` in MessageOptions. It will be actually removed by messageComponent after the quitting animation. see _Write Your Own Message Component_.

If you want to remove the directly without and animation and postprocess, use `messageInterface.forceRemove`.

### messageInterface.forceRemove

`forceRemove(id, namespace): null`

Remove a message by given id and namespace. It will remove the message from list immediately.

- `id`: string, the internal id of this message
- `namespace`: (optional) string, the namespace of the message, (default: 'default')
- **returns**:
- null

Won't throw any exception if the given message is not found.

Typically you don't really need this, unless you are writing a customized message component.

### messageInterface.update

`update(id, options, namespace): id`

update a message by given id and namespace. It will remove the message from list immediately.

- `id`: string, the internal id of this message
- `options`: MessageOptions, see `MessageOptions`
- `namespace`: (optional) string, the namespace of the message, (default: 'default')
- **returns**:
- null

Won't throw any exception if the given message is not found.

The new `options` will be applied to the previous message options, like setState().

You are not allowed to change these parameters: `id` and `namespace`.

Setting `{removed: false}` will lead to the same behavior as calling `messageInterface.remove`

### messageInterface.triggleGlobalAnimation

`triggleGlobalAnimation(enabled): enabled`

set if the global LayoutAnimation is enabled. This is disabled by default.

- `enabled`: (optional) boolean, enable it or not.
- **returns**:
- enabled: boolean, the new State

Call this function without providing any parameter, will trigger the globalAnimationEnabled.

## MessageOptions

You can pass more information as you like in message options. All those options will be transfered directly to the message components. It's quite easy to extend it such as borderRadius, backgroundColor, messageType, icon, etc. Just process them in your own message component.

Here list the options that buildin template message components will use:

| Prop            | Type    | Required | Description                                                             | Default |
| --------------- | ------- | -------- | ----------------------------------------------------------------------- | ------- |
| **`id`**        | string  | no       | Readonly, the internal id for the message                               | /       |
| **`namespace`** | string  | no       | Readonly, the namespace of the message                                  | /       |
| **`message`**   | string  | no       | The msaage body to be shown                                             | ''      |
| **`removed`**   | boolean | no       | Wether this message has been removed.                                   | false   |
| **`duration`**  | number  | no       | How long will this message show, in milliseconds. 0 means show forever. | 0       |

## Buildin Template Message Components

### buildinComponents.DefaultMessageComponent Component

The most simply template of a message component, with no animation.

It is implemented to handle 3 parameters: `message`, `duration` and `removed`.

### DefaultMessageComponentAnimated Component

The most simply template of a message component, with animation using `Animated`.

It is implemented to handle 3 parameters: `message`, `duration` and `removed`.

### DefaultTextMessageComponentFade Component

The default message component, with animation using `Animated`. Each message will show up by fading.

It is implemented to handle 3 parameters: `message`, `duration` and `removed`.

`message` should be a string.

### DefaultMessageComponentFade Component

Almost the same as `DefaultTextMessageComponent`, but parameter `message` can be any React Node rather than string.

It is implemented to handle 3 parameters: `message`, `duration` and `removed`.
