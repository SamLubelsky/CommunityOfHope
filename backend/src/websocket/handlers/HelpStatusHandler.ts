import { Socket } from 'socket.io'
import { WebSocketManager } from '../core/WebSocketManager'
import {
  getAllActiveHelpRequests,
  getUnclaimedHelpRequests,
} from '../../models/helpRequestModel'
import { getUserData } from '../../models/userModel'
import { getChat } from '../../models/chatsModel'

import { HelpRequest } from '../../types/helpRequest'

export interface HelpRequestsUpdate {
  Requests: HelpRequest[]
  timestamp: string
}

export class HelpStatusHandler {
  private wsManager: WebSocketManager

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager
    this.registerEventHandlers()
  }

  private registerEventHandlers(): void {
    this.wsManager.addEventHandler(
      'requestHelpRequestsUpdate',
      this.handleRequestHelpRequestsUpdate.bind(this),
    )
    this.wsManager.addEventHandler(
      'joinVolunteerRoom',
      this.handleJoinVolunteerRoom.bind(this),
    )
  }

  private async handleRequestHelpRequestsUpdate(socket: Socket): Promise<void> {
    // Send the current list of help requests to the requesting user
    await this.sendHelpRequestsUpdateToUser(socket.data.userId)
  }

  private handleJoinVolunteerRoom(socket: Socket): void {
    // This ensures volunteers join the volunteer room for receiving updates
    socket.join('volunteerRoom')
    console.log(
      `User ${socket.data.userId} joined volunteer room for help status updates`,
    )
  }

  // Public methods for external use

  /**
   * Notify all connected volunteers about any help request change
   * This sends the complete updated list of help requests
   */
  public async notifyHelpRequestsChanged(): Promise<void> {
    try {
      const helpRequests = await getAllActiveHelpRequests()
      const update: HelpRequestsUpdate = {
        Requests: helpRequests,
        timestamp: new Date().toISOString(),
      }

      this.wsManager.emitToRoom('volunteerRoom', 'helpRequestsUpdate', update)
      console.log(
        `Help requests update sent to volunteers: ${helpRequests.length} requests`,
      )
    } catch (error) {
      console.error('Error sending help requests update:', error)
    }
  }

  /**
   * Send help requests update to a specific user
   */
  public async sendHelpRequestsUpdateToUser(userId: string): Promise<void> {
    try {
      const helpRequests = await getAllActiveHelpRequests()
      const update: HelpRequestsUpdate = {
        Requests: helpRequests,
        timestamp: new Date().toISOString(),
      }

      this.wsManager.emitToUser(userId, 'helpRequestsUpdate', update)
      console.log(
        `Help requests update sent to user ${userId}: ${helpRequests.length} requests`,
      )
    } catch (error) {
      console.error('Error sending help requests update to user:', error)
    }
  }

  /**
   * Send unclaimed help requests to a specific user
   */
  public async sendUnclaimedHelpRequestsToUser(userId: string): Promise<void> {
    try {
      const unclaimedRequests = await getUnclaimedHelpRequests(userId)
      const update: HelpRequestsUpdate = {
        Requests: unclaimedRequests,
        timestamp: new Date().toISOString(),
      }

      this.wsManager.emitToUser(userId, 'helpRequestsUpdate', update)
      console.log(
        `Unclaimed help requests sent to user ${userId}: ${unclaimedRequests.length} requests`,
      )
    } catch (error) {
      console.error('Error sending unclaimed help requests to user:', error)
    }
  }

  /**
   * Notify a user about their personal help status change
   */
  public async notifyUserHelpStatusChange(
    userId: string,
    userRole: string,
  ): Promise<void> {
    try {
      const activeHelpRequests = await getAllActiveHelpRequests()
      let statusData: any = {}

      if (userRole === 'Volunteer' || userRole === 'Admin') {
        const userRequests = activeHelpRequests.filter(
          (request) => request.volunteer_id === userId,
        )
        if (userRequests.length > 0) {
          const helpRequest = userRequests[0]
          const { mom_id } = helpRequest
          const mom_data = await getUserData(mom_id)
          const mom_name = mom_data.firstName + ' ' + mom_data.lastName
          const chat = await getChat(mom_id, userId)
          const chatId = chat.id
          statusData = {
            status: 'Accepted',
            momName: mom_name,
            helpId: helpRequest.id,
            chatId,
          }
        } else {
          statusData = { status: 'Not Accepted' }
        }
      } else if (userRole === 'Mom') {
        const userRequests = activeHelpRequests.filter(
          (request) => request.mom_id === userId,
        )
        if (userRequests.length > 0) {
          const helpRequest = userRequests[0]
          const { volunteer_id, description } = helpRequest
          if (volunteer_id) {
            const volunteer_data = await getUserData(volunteer_id)
            const volunteer_name =
              volunteer_data.firstName + ' ' + volunteer_data.lastName
            const chat = await getChat(userId, volunteer_id)
            const chatId = chat.id
            statusData = {
              status: 'Accepted',
              volunteerName: volunteer_name,
              chatId,
            }
          } else {
            statusData = { status: 'Requested', description }
          }
        } else {
          statusData = { status: 'Not Requested' }
        }
      }

      this.wsManager.emitToUser(userId, 'helpStatusUpdate', {
        ...statusData,
        timestamp: new Date().toISOString(),
      })
      console.log(
        `Help status update sent to user ${userId}: ${statusData.status}`,
      )
    } catch (error) {
      console.error('Error sending help status update to user:', error)
    }
  }

  /**
   * Get the number of connected volunteers
   */
  public getConnectedVolunteerCount(): number {
    // This would need to be implemented based on how you track volunteer connections
    // For now, we'll return the total connection count
    return this.wsManager.getUserConnectionManager().getConnectionCount()
  }
}
