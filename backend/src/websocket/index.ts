import { Server as HttpServer } from 'http'
import { WebSocketManager } from './core/WebSocketManager'
import { ChatHandler } from './handlers/ChatHandler'
import { HelpStatusHandler } from './handlers/HelpStatusHandler'

let wsManager: WebSocketManager | null = null
let chatHandler: ChatHandler | null = null
let helpStatusHandler: HelpStatusHandler | null = null

export interface WebSocketOptions {
  cors?: any
  enableChat?: boolean
  enableHelpStatus?: boolean
}

export const initializeWebSocket = (
  httpServer: HttpServer,
  options: WebSocketOptions = {},
): WebSocketManager => {
  const { cors, enableChat = true, enableHelpStatus = true } = options

  // Initialize the core WebSocket manager
  wsManager = new WebSocketManager(httpServer, cors)

  // Initialize chat handler if enabled
  if (enableChat) {
    chatHandler = new ChatHandler(wsManager)
  }

  // Initialize help status handler if enabled
  if (enableHelpStatus) {
    helpStatusHandler = new HelpStatusHandler(wsManager)
  }

  return wsManager
}

export const getWebSocketManager = (): WebSocketManager | null => {
  return wsManager
}

export const getChatHandler = (): ChatHandler | null => {
  return chatHandler
}

export const getHelpStatusHandler = (): HelpStatusHandler | null => {
  return helpStatusHandler
}

// Export classes for direct use if needed
export { WebSocketManager } from './core/WebSocketManager'
export { ChatHandler } from './handlers/ChatHandler'
export { HelpStatusHandler } from './handlers/HelpStatusHandler'
export { UserConnectionManager } from './core/UserConnectionManager'
export { WebSocketAuthMiddleware } from './core/WebSocketAuthMiddleware'
