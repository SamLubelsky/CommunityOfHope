import { Chat } from '../utils/definitions'
import { executeQuery } from '../config/database'

export const getMostRecentMessage = async (chatId: string) => {
  const rows = await executeQuery(
    'SELECT id, chatid as "chatId", message, senderid as "senderId", datesent as "dateSent" FROM messages where chatId=$1 ORDER BY dateSent DESC LIMIT 1',
    [chatId],
  )
  return rows
}
export const createChat = async (momId: string, volunteerId: string) => {
  const rows = await executeQuery(
    'INSERT INTO chats (momId, volunteerId) VALUES ($1, $2) RETURNING id',
    [momId, volunteerId],
  )
  return rows[0].id
}
export const getChatRoomMessages = async () => {
  const rows = await executeQuery(
    'SELECT id, chatid as "chatId", message, senderid as "senderId", datesent as "dateSent"  FROM messages where chatId=-1',
    [],
  )
  return rows
}
export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const rows = await executeQuery(
    `SELECT chats.id, chats.momId as "momId", chats.volunteerId as "volunteerId",
                                   momUser.firstName || ' ' || momUser.lastName AS "momName",
                                   volUser.firstName || ' ' || volUser.lastName AS "volName"
                                   FROM chats 
                                   JOIN users volUser
                                   ON volUser.id = chats.volunteerId
                                   JOIN users momUser
                                   ON momUser.id = chats.momId
                                   where chats.id=$1`,
    [chatId],
  )
  if (rows) {
    return rows[0]
  } else {
    return Promise.reject(new Error('Chat not found'))
  }
}
export const getChatByIdWithName = async (
  chatId: string,
  userId: string,
): Promise<Chat | null> => {
  const rows = await executeQuery(
    `SELECT chats.id, chats.momId as "momId", chats.volunteerId as "volunteerId",
    users.firstName || ' ' || users.lastName AS "otherName", users.profileLink AS "otherProfileLink"
    FROM chats 
    JOIN users
    ON (users.id = chats.volunteerId AND chats.momId = $2)
    OR (users.id = chats.momId AND chats.volunteerId = $2)
    where chats.id=$1`,
    [chatId, userId],
  )
  if (rows) {
    return rows[0]
  } else {
    return Promise.reject(new Error('Chat not found'))
  }
}

export const getChat = async (
  momId: string,
  volunteerId: string,
): Promise<Chat | null> => {
  const rows = await executeQuery(
    'SELECT id, momid as "momId", volunteerid as "volunteerId" FROM chats where momId=$1 AND volunteerId=$2',
    [momId, volunteerId],
  )
  if (rows.length === 0) {
    return Promise.reject(new Error('Chat not found'))
  }
  return rows[0]
}

export const getChats = async (userId: string): Promise<Chat[] | null> => {
  const rows = await executeQuery(
    `SELECT chats.id, chats.momid as "momId", chats.volunteerid as "volunteerId", chats.lastMessageTime as "lastMessageTime",
                                     users.firstName || ' ' || users.lastName as "otherName", users.profileLink as "otherProfileLink", recent_messages.message AS "lastMessage" 
                                      FROM 
                                        chats chats
                                        LEFT JOIN users
                                          ON (chats.momid = users.id AND chats.volunteerId = $1)
                                          OR (chats.volunteerId = users.Id AND chats.momId = $1)
                                        LEFT JOIN (
                                          SELECT chatId, MAX(dateSent) AS maxDate
                                          FROM messages
                                          GROUP BY chatId
                                        ) recent_messages_info
                                        ON chats.id = recent_messages_info.chatId
                                        LEFT JOIN messages recent_messages
                                        ON recent_messages.chatId = chats.id AND recent_messages.dateSent = recent_messages_info.maxDate
                                      WHERE
                                        chats.momId=$1 OR 
                                        chats.volunteerId=$1
                                      ORDER BY lastMessageTime DESC`,
    [userId],
  )
  return rows
}
export const retrieveAllChats = async (): Promise<Chat[] | null> => {
  // This function retrieves all chats, regardless of the user
  // It gets the name of the mom and volunteer associated with each chat
  const rows = await executeQuery(
    `SELECT chats.id, chats.momid as "momId", chats.volunteerid as "volunteerId", chats.lastMessageTime as "lastMessageTime",
                                     mom.firstName || ' ' || mom.lastName as "momName", volunteer.firstName || ' ' || volunteer.lastName as "volunteerName", 
                                     recent_messages.message AS "lastMessage" 
                                      FROM 
                                        chats
                                        LEFT JOIN users mom
                                          ON chats.momid = mom.id 
                                        LEFT JOIN users volunteer
                                          ON chats.volunteerId = volunteer.id 
                                        LEFT JOIN (
                                          SELECT chatId, MAX(dateSent) AS maxDate
                                          FROM messages
                                          GROUP BY chatId
                                        ) recent_messages_info
                                        ON chats.id = recent_messages_info.chatId
                                        LEFT JOIN messages recent_messages
                                        ON recent_messages.chatId = chats.id AND recent_messages.dateSent = recent_messages_info.maxDate
                                      ORDER BY lastMessageTime DESC`,
    [],
  )
  return rows
}
export const getMessageData = async (chatId: string) => {
  const rows = await executeQuery(
    'SELECT id, chatid as "chatId", message, senderid as "senderId", datesent as "dateSent" FROM messages where chatId=$1',
    [chatId],
  )
  return rows
}

export const createMessage = async (
  chatId: string,
  senderId: string,
  message: string,
  dateSent: string,
) => {
  await executeQuery(
    'INSERT INTO messages (chatId, senderId, message, dateSent) VALUES ($1, $2, $3, $4)',
    [chatId, senderId, message, dateSent],
  )
  await executeQuery('UPDATE chats SET lastMessageTime=$1 WHERE id=$2', [
    dateSent,
    chatId,
  ])
}
