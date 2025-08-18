export type Chat = {
  chatId: number
  volunteerId: number
  momId: number
  otherProfileLink: string
}
export type Message = {
  senderId: number
  message: string
  received?: boolean
  messageId?: string
}
