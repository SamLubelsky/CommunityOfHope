import { useEffect, useState, useCallback } from 'react'
import { webSocketService } from '@/app/socket'

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(webSocketService.isConnected())
  const [isConnecting, setIsConnecting] = useState(
    webSocketService.isConnecting(),
  )

  // Connect to WebSocket
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      await webSocketService.connect()
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect()
  }, [])

  // Emit an event
  const emit = useCallback((event: string, data: any) => {
    return webSocketService.emit(event, data)
  }, [])

  // Subscribe to an event
  const on = useCallback((event: string, handler: (data: any) => void) => {
    return webSocketService.on(event, handler)
  }, [])

  // Subscribe to connection status changes
  const onConnectionChange = useCallback(
    (handler?: (connected: boolean) => void) => {
      return webSocketService.onConnectionChange((connected) => {
        setIsConnected(connected)
        if (handler) {
          handler(connected)
        }
      })
    },
    [],
  )

  // Initialize connection status subscription only
  useEffect(() => {
    // Don't automatically connect - let components decide when to connect
    const unsubscribeConnection = onConnectionChange()

    return () => {
      unsubscribeConnection()
    }
  }, [onConnectionChange])

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    emit,
    on,
    onConnectionChange,
  }
}
