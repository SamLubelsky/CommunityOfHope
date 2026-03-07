import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react'
import { AppState } from 'react-native'
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

  const connectingRef = useRef(false)

  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptRef = useRef(0)

  const appState = useRef(AppState.currentState)

  const BASE_DELAY = 1000
  const MAX_DELAY = 30000

  const connect = async () => {
    if (connectingRef.current) {
      console.log('Connection already in progress')
      return
    }

    if (webSocketService.isConnected()) {
      return
    }

    try {
      connectingRef.current = true
      setIsConnecting(true)

      await webSocketService.connect()
    } catch (error) {
      console.error('WebSocket connect failed:', error)
    } finally {
      connectingRef.current = false
    }
  }

  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) return

    if (appState.current !== 'active') {
      console.log('Skipping reconnect because app is backgrounded')
      return
    }

    const delay = Math.min(
      BASE_DELAY * 2 ** reconnectAttemptRef.current,
      MAX_DELAY,
    )

    console.log(`WebSocket reconnect in ${delay}ms`)

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectTimeoutRef.current = null
      reconnectAttemptRef.current += 1

      if (!webSocketService.isConnected()) {
        connect()
      }
    }, delay)
  }

  const disconnect = () => {
    connectingRef.current = false

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

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
    connect()

    const unsubscribe = webSocketService.onConnectionChange((connected) => {
      setIsConnected(connected)
      setIsConnecting(false)
      connectingRef.current = false

      if (connected) {
        reconnectAttemptRef.current = 0

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      } else {
        scheduleReconnect()
      }
    })

    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextState) => {
        const previousState = appState.current
        appState.current = nextState

        if (previousState.match(/inactive|background/) && nextState === 'active') {
          console.log('App returned to foreground')

          if (!webSocketService.isConnected()) {
            reconnectAttemptRef.current = 0
            connect()
          }
        }
      },
    )

    return () => {
      unsubscribe()

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      appStateSubscription.remove()
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