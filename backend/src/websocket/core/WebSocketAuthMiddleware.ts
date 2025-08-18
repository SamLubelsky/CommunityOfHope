import { Socket } from 'socket.io'
import { parse } from 'cookie'
import { getUserIdFromSessionId } from '../../models/sessionModel'
import { getUserData } from '../../models/userModel'

export class WebSocketAuthMiddleware {
  async authenticate(socket: Socket, next: (err?: Error) => void): Promise<void> {
    try {
      const cookieHeader = socket.handshake.headers.cookie
      if (!cookieHeader) {
        console.log('No cookies found')
        return next(new Error('No cookies found'))
      }

      // Parse the session cookie
      const cookies = parse(cookieHeader)
      const sessionCookie = cookies['connect.sid']
      
      if (!sessionCookie) {
        console.log('No session cookie found')
        return next(new Error('No session cookie found'))
      }

      const dotPos = sessionCookie.indexOf('.')
      const sessionId = sessionCookie.substring(2, dotPos)

      // Retrieve the session and user data
      try {
        const userId = await getUserIdFromSessionId(sessionId)
        const userData = await getUserData(userId)
        
        // Attach user data to socket for later use
        socket.data.userId = userId
        socket.data.userRole = userData.role
        socket.data.userData = userData
        
        next()
      } catch (error) {
        console.log('Authentication Error:', error)
        next(new Error('Authentication error'))
      }
    } catch (err) {
      console.log('Other auth error:', err)
      next(new Error('Authentication error'))
    }
  }
}
