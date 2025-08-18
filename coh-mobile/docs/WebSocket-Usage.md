# WebSocket Service Usage Guide

This document explains how to use the simplified WebSocket service in your React Native components.

## Overview

The WebSocket functionality has been refactored into a simple, generic service that can be used across multiple components. The service provides:

- Singleton WebSocket connection management
- Generic event emission and subscription system
- Connection status monitoring
- Simple React hooks for easy integration

## Files Structure

- `app/socket.ts` - Main WebSocket service class and basic hook
- `hooks/useWebSocket.ts` - Simple React hook for WebSocket functionality
- `components/WebSocketStatus.tsx` - Example component showing connection status

## Basic Usage

### 1. Using the WebSocket Service Directly

```typescript
import { webSocketService } from '@/app/socket'

// Connect to WebSocket
webSocketService.connect()

// Emit an event
webSocketService.emit('message', { text: 'Hello!', userId: 123 })

// Subscribe to events
const unsubscribe = webSocketService.on('message', (data) => {
  console.log('New message:', data)
})

// Subscribe to connection changes
const unsubscribeConnection = webSocketService.onConnectionChange(
  (connected) => {
    console.log('Connection status:', connected)
  },
)

// Clean up
unsubscribe()
unsubscribeConnection()
webSocketService.disconnect()
```

### 2. Using the useWebSocket Hook

```typescript
import { useWebSocket } from '@/hooks/useWebSocket'

const MyComponent = () => {
  const { isConnected, emit, on } = useWebSocket()

  useEffect(() => {
    // Subscribe to custom events
    const unsubscribe = on('customEvent', (data) => {
      console.log('Custom event received:', data)
    })

    return () => unsubscribe()
  }, [])

  const handleSendMessage = () => {
    emit('message', { text: 'Hello!', userId: 123 })
  }

  return (
    <View>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
      <Button onPress={handleSendMessage} title='Send Message' />
    </View>
  )
}
```

### 3. Chat-Specific Implementation (Example)

```typescript
import { useWebSocket } from '@/hooks/useWebSocket'

const ChatComponent = ({ chatId, senderId }) => {
  const [messages, setMessages] = useState([])
  const { emit, on } = useWebSocket()

  useEffect(() => {
    // Subscribe to chat messages
    const unsubscribeMessage = on('message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    // Subscribe to message confirmation
    const unsubscribeConfirmation = on('messageReceived', (data) => {
      console.log('Message confirmed:', data)
    })

    return () => {
      unsubscribeMessage()
      unsubscribeConfirmation()
    }
  }, [])

  const handleSendMessage = (messageText) => {
    const messageData = {
      message: messageText,
      senderId: senderId,
      chatId: chatId,
    }

    const success = emit('message', messageData)
    if (success) {
      // Message sent successfully
      console.log('Message sent')
    }
  }

  return (
    <View>
      {messages.map((message, index) => (
        <Text key={index}>{message.message}</Text>
      ))}
    </View>
  )
}
```

## Connection Status Component

Use the `WebSocketStatus` component to show connection status in your app:

```typescript
import { WebSocketStatus } from '@/components/WebSocketStatus'

const MyScreen = () => {
  return (
    <View>
      <WebSocketStatus />
      {/* Your other components */}
    </View>
  )
}
```

## Best Practices

1. **Keep it simple**: The WebSocket service is generic - handle specific logic in your components

2. **Subscribe to events in useEffect**: Always set up event listeners in useEffect and clean them up

3. **Handle connection status**: Check if the WebSocket is connected before sending messages

4. **Clean up subscriptions**: Always return cleanup functions from useEffect

5. **Error handling**: Add error handling specific to your use case in your components

## API Reference

### WebSocketService Methods

- `connect()` - Establishes WebSocket connection
- `disconnect()` - Closes WebSocket connection
- `emit(event, data)` - Emits an event with data
- `on(event, handler)` - Subscribe to an event
- `onConnectionChange(handler)` - Subscribe to connection status changes
- `isConnected()` - Check if currently connected
- `getSocket()` - Get the underlying socket instance

### useWebSocket Hook

Returns an object with:

- `isConnected` - Boolean connection status
- `connect()` - Connect function
- `disconnect()` - Disconnect function
- `emit(event, data)` - Emit event function
- `on(event, handler)` - Subscribe to event function
- `onConnectionChange(handler)` - Subscribe to connection changes function

## Example: Chat Implementation

Here's how the chat component uses the generic WebSocket service:

```typescript
// In [slug].tsx
const { emit, on } = useWebSocket()

useEffect(() => {
  // Subscribe to chat-specific events
  const unsubscribeMessage = on('message', (data: Message) => {
    setMessages((prev) => [...prev, data])
  })

  const unsubscribeConfirmation = on('messageReceived', (msg) => {
    console.log('Message confirmed')
  })

  return () => {
    unsubscribeMessage()
    unsubscribeConfirmation()
  }
}, [])

const sendMessage = (text: string) => {
  const data = { message: text, senderId: id, chatId }
  emit('message', data)
}
```

This approach keeps the WebSocket service generic and reusable while allowing each component to handle its own specific logic.
