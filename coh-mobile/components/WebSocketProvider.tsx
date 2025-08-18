import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react'
import { webSocketService } from '@/app/socket'

interface WebSocketContextType {
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  emit: (event: string, data: any) => boolean
  on: (event: string, handler: (data: any) => void) => () => void
  getConnectionInfo: () => any
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error(
      'useWebSocketContext must be used within a WebSocketProvider',
    )
  }
  return context
}

interface WebSocketProviderProps {
  children: React.ReactNode
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(webSocketService.isConnected())
  const [isConnecting, setIsConnecting] = useState(
    webSocketService.isConnecting(),
  )

  // Use ref to track if we're already connecting to prevent multiple attempts
  const connectingRef = useRef(false)

  const connect = async () => {
    // Prevent multiple simultaneous connection attempts
    if (connectingRef.current) {
      console.log('Connection already in progress, skipping duplicate attempt')
      return
    }

    // If already connected, don't try to connect again
    if (webSocketService.isConnected()) {
      console.log('Already connected, skipping connection attempt')
      return
    }

    try {
      connectingRef.current = true
      setIsConnecting(true)
      await webSocketService.connect()
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setIsConnecting(false)
      connectingRef.current = false
    }
  }

  const disconnect = () => {
    connectingRef.current = false
    webSocketService.disconnect()
  }

  const emit = (event: string, data: any) => {
    return webSocketService.emit(event, data)
  }

  const on = (event: string, handler: (data: any) => void) => {
    return webSocketService.on(event, handler)
  }

  const getConnectionInfo = () => {
    return webSocketService.getConnectionInfo()
  }

  useEffect(() => {
    // Connect when the provider mounts
    connect()

    // Subscribe to connection changes
    const unsubscribe = webSocketService.onConnectionChange((connected) => {
      setIsConnected(connected)
      setIsConnecting(false) // Reset connecting state when connection status changes
      connectingRef.current = false // Reset connecting ref
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const value: WebSocketContextType = {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    emit,
    on,
    getConnectionInfo,
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}
