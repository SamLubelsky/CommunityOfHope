import { io, Socket } from 'socket.io-client'
import { BACKEND_URL } from './config'

// Generic WebSocket service class
class WebSocketService {
  private static instance: WebSocketService | null = null
  private socket: Socket | null = null
  private eventHandlers: Map<string, ((data: any) => void)[]> = new Map()
  private connectionHandlers: ((connected: boolean) => void)[] = []
  private _isConnecting: boolean = false
  private connectionPromise: Promise<Socket> | null = null
  private connectionAttempts: number = 0
  private maxReconnectAttempts: number = 3

  // Private constructor to enforce singleton
  private constructor() {}

  // Singleton getInstance method
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  connect() {
    // If already connected, return existing socket
    if (this.socket?.connected) {
      console.log('WebSocket already connected, returning existing connection')
      return Promise.resolve(this.socket)
    }

    // If already connecting, return the existing promise
    if (this._isConnecting && this.connectionPromise) {
      console.log(
        'WebSocket connection already in progress, returning existing promise',
      )
      return this.connectionPromise
    }

    // Check if we've exceeded max reconnection attempts
    if (this.connectionAttempts >= this.maxReconnectAttempts) {
      console.warn('Max WebSocket reconnection attempts reached')
      return Promise.reject(new Error('Max reconnection attempts reached'))
    }

    // Start new connection
    this._isConnecting = true
    this.connectionAttempts++

    console.log(
      `Attempting WebSocket connection (attempt ${this.connectionAttempts}/${this.maxReconnectAttempts})`,
    )

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        // If there's an existing socket that's not connected, clean it up
        if (this.socket && !this.socket.connected) {
          console.log('Cleaning up existing disconnected socket')
          this.socket.removeAllListeners()
          this.socket = null
        }

        this.socket = io(BACKEND_URL, {
          withCredentials: true,
          // Add connection timeout
          timeout: 10000,
          // Prevent multiple connections
          forceNew: false,
          // Add reconnection settings
          reconnection: false, // We'll handle reconnection manually
        })

        this.socket.on('connect', () => {
          console.log('WebSocket connected successfully')
          this._isConnecting = false
          this.connectionAttempts = 0 // Reset attempts on successful connection
          this.notifyConnectionChange(true)
          resolve(this.socket!)
        })

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason)
          this._isConnecting = false
          this.notifyConnectionChange(false)

          // If it was an unexpected disconnect, we might want to attempt reconnection
          if (reason === 'io server disconnect') {
            console.log('Server disconnected, will need manual reconnection')
          }
        })

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error)
          this._isConnecting = false
          reject(error)
        })

        // Set up existing event handlers
        this.eventHandlers.forEach((handlers, event) => {
          this.socket!.on(event, (data) => {
            this.notifyEventHandlers(event, data)
          })
        })
      } catch (error) {
        console.error('Error creating WebSocket connection:', error)
        this._isConnecting = false
        reject(error)
      }
    })

    return this.connectionPromise
  }

  disconnect() {
    console.log('Disconnecting WebSocket')
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
      this._isConnecting = false
      this.connectionPromise = null
      this.connectionAttempts = 0
      // Clear all event handlers when disconnecting
      this.eventHandlers.clear()
      this.notifyConnectionChange(false)
    }
  }

  // Generic method to emit events
  emit(event: string, data: any) {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected, attempting to connect...')
      this.connect()
        .then(() => {
          this.socket!.emit(event, data)
        })
        .catch((error) => {
          console.error('Failed to connect for emit:', error)
        })
      return false
    }

    this.socket.emit(event, data)
    return true
  }

  // Subscribe to any event
  on(event: string, handler: (data: any) => void) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)

    // Set up socket listener if socket exists
    if (this.socket) {
      this.socket.on(event, (data) => {
        this.notifyEventHandlers(event, data)
      })
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(event)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  // Subscribe to connection status changes
  onConnectionChange(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler)

    // Return unsubscribe function
    return () => {
      const index = this.connectionHandlers.indexOf(handler)
      if (index > -1) {
        this.connectionHandlers.splice(index, 1)
      }
    }
  }

  private notifyEventHandlers(event: string, data: any) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  private notifyConnectionChange(connected: boolean) {
    this.connectionHandlers.forEach((handler) => handler(connected))
  }

  isConnected() {
    return this.socket?.connected || false
  }

  isConnecting() {
    return this._isConnecting
  }

  getSocket() {
    return this.socket
  }

  // Reset connection attempts (useful for manual reconnection)
  resetConnectionAttempts() {
    this.connectionAttempts = 0
  }

  // Get connection info for debugging
  getConnectionInfo() {
    return {
      isConnected: this.isConnected(),
      isConnecting: this.isConnecting(),
      connectionAttempts: this.connectionAttempts,
      hasSocket: !!this.socket,
      socketId: this.socket?.id,
    }
  }
}

// Create singleton instance using getInstance
export const webSocketService = WebSocketService.getInstance()

// Simple React hook for using WebSocket
export const useWebSocket = () => {
  return {
    connect: () => webSocketService.connect(),
    disconnect: () => webSocketService.disconnect(),
    emit: (event: string, data: any) => webSocketService.emit(event, data),
    on: (event: string, handler: (data: any) => void) =>
      webSocketService.on(event, handler),
    onConnectionChange: (handler: (connected: boolean) => void) =>
      webSocketService.onConnectionChange(handler),
    isConnected: () => webSocketService.isConnected(),
    isConnecting: () => webSocketService.isConnecting(),
    getSocket: () => webSocketService.getSocket(),
    getConnectionInfo: () => webSocketService.getConnectionInfo(),
  }
}

// Export the service instance for direct use
export default webSocketService
