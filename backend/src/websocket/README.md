# WebSocket Architecture

This directory contains a refactored, modular WebSocket implementation that separates concerns and makes the code reusable for different features.

## Structure

```
websocket/
├── core/
│   ├── WebSocketManager.ts      # Main WebSocket manager
│   ├── WebSocketAuthMiddleware.ts # Authentication middleware
│   └── UserConnectionManager.ts   # User connection tracking
├── handlers/
│   ├── ChatHandler.ts           # Chat-specific functionality
│   └── HelpStatusHandler.ts     # Help request status updates
├── index.ts                     # Main entry point
└── README.md                    # This file
```

## Core Components

### WebSocketManager

The main class that handles:

- Socket.io server setup
- CORS configuration
- Event handler registration
- User connection management
- Room management

### WebSocketAuthMiddleware

Handles authentication for WebSocket connections:

- Session validation
- User data retrieval
- Role-based room assignment

### UserConnectionManager

Tracks connected users:

- User ID to socket ID mapping
- Connection status
- User management utilities

## Handlers

### ChatHandler

Handles chat-specific functionality:

- Message processing
- Database persistence
- Push notifications
- Real-time message delivery

### HelpStatusHandler

Handles help request status updates:

- New help request notifications
- Status change notifications (claimed, completed, deactivated, unclaimed)
- Real-time updates to all connected volunteers
- Volunteer room management

## Usage

### Basic Initialization

```typescript
import { initializeWebSocket } from './websocket'

const httpServer = http.createServer(app)
const wsManager = initializeWebSocket(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  enableChat: true,
  enableHelpStatus: true,
})
```

### Adding Custom Handlers

1. Create a new handler class:

```typescript
// handlers/CustomHandler.ts
import { Socket } from 'socket.io'
import { WebSocketManager } from '../core/WebSocketManager'

export class CustomHandler {
  private wsManager: WebSocketManager

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager
    this.registerEventHandlers()
  }

  private registerEventHandlers(): void {
    this.wsManager.addEventHandler(
      'customEvent',
      this.handleCustomEvent.bind(this),
    )
  }

  private handleCustomEvent(socket: Socket, data: any): void {
    // Handle custom event
    console.log('Custom event received:', data)
  }

  // Public methods for external use
  public sendCustomMessage(userId: string, message: any): void {
    this.wsManager.emitToUser(userId, 'customMessage', message)
  }
}
```

2. Update the main index.ts to include your handler:

```typescript
// websocket/index.ts
import { CustomHandler } from './handlers/CustomHandler'

let customHandler: CustomHandler | null = null

export const initializeWebSocket = (
  httpServer: HttpServer,
  options: WebSocketOptions = {},
): WebSocketManager => {
  const { enableCustom = true } = options

  wsManager = new WebSocketManager(httpServer, cors)

  if (enableCustom) {
    customHandler = new CustomHandler(wsManager)
  }

  return wsManager
}

export const getCustomHandler = (): CustomHandler | null => {
  return customHandler
}
```

### Using Handlers from Other Parts of the Application

```typescript
import { getChatHandler, getHelpStatusHandler } from './websocket'

// In a controller or service
const chatHandler = getChatHandler()
if (chatHandler) {
  chatHandler.sendMessageToUser(userId, messageData)
}

const helpStatusHandler = getHelpStatusHandler()
if (helpStatusHandler) {
  helpStatusHandler.notifyNewHelpRequest(helpRequestData)
  helpStatusHandler.notifyHelpRequestClaimed(helpRequestId, volunteerId, momId)
}
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each handler focuses on specific functionality
2. **Reusability**: Core WebSocket functionality can be used by multiple features
3. **Maintainability**: Easy to modify or extend individual features
4. **Testability**: Each component can be tested independently
5. **Scalability**: Easy to add new features without modifying existing code

## Migration from Old Structure

The old `websocket.ts` file has been replaced with this modular structure. The main `initializeWebSocket` function maintains the same interface for backward compatibility, but now supports additional options for enabling/disabling specific handlers.

## Environment Variables

Make sure to set `NODE_ENV` to enable development mode for proper CORS configuration:

```bash
export NODE_ENV=development
```

This will enable ngrok support and other development features.
