import { Socket } from 'socket.io'
import { createMessage, getChatById } from '../../models/chatsModel'
import { getUserData } from '../../models/userModel'
import { sendNotification } from '../../notifications/notifications'
import { WebSocketManager } from '../core/WebSocketManager'

export interface ChatMessage {
  senderId: string
  message: string
  chatId: string
}

export class ChatHandler {
  private wsManager: WebSocketManager

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager
    this.registerEventHandlers()
  }

  private registerEventHandlers(): void {
    this.wsManager.addEventHandler('message', this.handleMessage.bind(this))
  }

  private async handleMessage(socket: Socket, msg: ChatMessage): Promise<void> {
    const { senderId, message, chatId } = msg
    
    // Echo message back to sender
    socket.to(socket.id).emit('messageReceived', msg)
    
    const chat = await getChatById(chatId)
    
    if (chat) {
      // Save message to database
      await createMessage(chatId, senderId, message, new Date().toISOString())
      
      // Get sender information
      const sender = await getUserData(senderId)
      const senderName = sender.firstName + ' ' + sender.lastName
      const messageBody = 'You received a message from ' + senderName
      
      const notificationData = {
        sound: 'default',
        body: messageBody,
        data: {},
      }

      const { momId, volunteerId } = chat
      const userConnectionManager = this.wsManager.getUserConnectionManager()

      // Handle message from mom to volunteer
      if (senderId === momId) {
        sendNotification(volunteerId, notificationData)
        console.log('Sending notification to volunteer:', volunteerId)
        
        if (userConnectionManager.isUserConnected(volunteerId)) {
          this.wsManager.emitToUser(volunteerId, 'message', msg)
        }
      }
      
      // Handle message from volunteer to mom
      if (senderId === volunteerId) {
        sendNotification(momId, notificationData)
        console.log('Sending notification to mom:', momId)
        
        if (userConnectionManager.isUserConnected(momId)) {
          this.wsManager.emitToUser(momId, 'message', msg)
        }
      }
    }
  }

  // Public methods for external use
  public sendMessageToUser(userId: string, message: any): void {
    this.wsManager.emitToUser(userId, 'message', message)
  }

  public sendMessageToRoom(room: string, message: any): void {
    this.wsManager.emitToRoom(room, 'message', message)
  }

  public broadcastMessage(message: any): void {
    this.wsManager.broadcastToAll('message', message)
  }
}
