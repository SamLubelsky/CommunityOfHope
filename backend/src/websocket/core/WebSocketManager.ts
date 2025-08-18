import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { WebSocketAuthMiddleware } from './WebSocketAuthMiddleware'
import { UserConnectionManager } from './UserConnectionManager'

export interface WebSocketEvent {
  event: string
  handler: (socket: Socket, data: any) => Promise<void> | void
}

export class WebSocketManager {
  private io: Server
  private authMiddleware: WebSocketAuthMiddleware
  private userConnectionManager: UserConnectionManager
  private eventHandlers: Map<string, (socket: Socket, data: any) => Promise<void> | void> = new Map()

  constructor(httpServer: HttpServer, corsOptions?: any) {
    this.io = new Server(httpServer, {
      cors: corsOptions || {
        origin: 'http://localhost:8081',
        credentials: true,
      },
    })
    
    this.authMiddleware = new WebSocketAuthMiddleware()
    this.userConnectionManager = new UserConnectionManager()
    
    this.setupMiddleware()
    this.setupConnectionHandlers()
  }

  private setupMiddleware(): void {
    this.io.use(this.authMiddleware.authenticate.bind(this.authMiddleware))
  }

  private setupConnectionHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User ${socket.id} connected`)
      
      // Store user connection
      const userId = socket.data.userId
      if (userId) {
        this.userConnectionManager.addUser(userId, socket.id)
        
        // Join role-based rooms
        this.joinRoleBasedRooms(socket, socket.data.userRole)
      }

      // Register event handlers
      this.eventHandlers.forEach((handler, event) => {
        socket.on(event, (data) => handler(socket, data))
      })

      socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`)
        if (userId) {
          this.userConnectionManager.removeUser(userId)
        }
      })
    })
  }

  private joinRoleBasedRooms(socket: Socket, role: string): void {
    if (role === 'Volunteer' || role === 'Admin') {
      socket.join('volunteerRoom')
    }
    if (role === 'Mom') {
      socket.join('momRoom')
    }
  }

  public addEventHandler(event: string, handler: (socket: Socket, data: any) => Promise<void> | void): void {
    this.eventHandlers.set(event, handler)
  }

  public removeEventHandler(event: string): void {
    this.eventHandlers.delete(event)
  }

  public getIO(): Server {
    return this.io
  }

  public getUserConnectionManager(): UserConnectionManager {
    return this.userConnectionManager
  }

  public emitToUser(userId: string, event: string, data: any): void {
    const socketId = this.userConnectionManager.getUserSocketId(userId)
    if (socketId) {
      this.io.to(socketId).emit(event, data)
    }
  }

  public emitToRoom(room: string, event: string, data: any): void {
    this.io.to(room).emit(event, data)
  }

  public broadcastToAll(event: string, data: any): void {
    this.io.emit(event, data)
  }
}
