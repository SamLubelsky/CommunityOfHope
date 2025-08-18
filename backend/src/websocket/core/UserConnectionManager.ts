export class UserConnectionManager {
  private connectedUsers: Map<string, string> = new Map() // userId -> socketId
  private socketToUser: Map<string, string> = new Map() // socketId -> userId

  public addUser(userId: string, socketId: string): void {
    this.connectedUsers.set(userId, socketId)
    this.socketToUser.set(socketId, userId)
  }

  public removeUser(userId: string): void {
    const socketId = this.connectedUsers.get(userId)
    if (socketId) {
      this.connectedUsers.delete(userId)
      this.socketToUser.delete(socketId)
    }
  }

  public removeUserBySocketId(socketId: string): void {
    const userId = this.socketToUser.get(socketId)
    if (userId) {
      this.connectedUsers.delete(userId)
      this.socketToUser.delete(socketId)
    }
  }

  public getUserSocketId(userId: string): string | undefined {
    return this.connectedUsers.get(userId)
  }

  public getUserIdBySocketId(socketId: string): string | undefined {
    return this.socketToUser.get(socketId)
  }

  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId)
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys())
  }

  public getConnectedSocketIds(): string[] {
    return Array.from(this.connectedUsers.values())
  }

  public getConnectionCount(): number {
    return this.connectedUsers.size
  }

  public clearAll(): void {
    this.connectedUsers.clear()
    this.socketToUser.clear()
  }
}
