import {Chat} from '../utils/definitions'
import {executeQuery} from '../config/database'


export const createChat = async (volunteer_id: string, mom_id: string) => {
  executeQuery('INSERT INTO chats (volunteerId, momId) VALUES ($1, $2)', [volunteer_id, mom_id]);
}
export const getChatRoomMessages = async () => {
  const rows = await executeQuery('SELECT id, chatid as "chatId", message, senderid as "senderId", datesent as "dateSent"  FROM messages where chatId=-1', []);
  return rows;
}
export const createChatRoomMessage = async (senderId: string, message: string, dateSent: string) => {
  executeQuery('INSERT INTO messages (chatId, senderId, message, dateSent) VALUES ($1, $2, $3, $4)', [-1, senderId, message, dateSent]);
};
export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const rows = await executeQuery('SELECT id, momid as "momId", volunteerid as "volunteerId" FROM chats where id=$1', [chatId]);
  if(rows){
    return rows[0];
  } else{
    return Promise.reject(new Error('Chat not found'));
  }
}

export const getChat = async (momId: string, volunteerId: string): Promise<Chat | null> => {
  const rows = await executeQuery('SELECT id, momid as "momId", volunteerid as "volunteerId" FROM chats where momId=$1 AND volunteerId=$2', [momId, volunteerId]);
  if(rows.length === 0){
    return Promise.reject(new Error('Chat not found'));
  }
  return rows[0];
}

export const getChats = async (userId: string, role: string): Promise<Chat[] | null> => {
  if(role == 'Mom' || role == 'Admin'){
    const rows = await executeQuery(`SELECT chats.id, chats.momid as "momId", chats.volunteerid as "volunteerId", chats.lastMessageTime as "lastMessageTime",
                                     users.firstName || ' ' || users.lastName as "otherName", users.profileLink as "otherProfileLink"
                                     FROM 
                                        chats chats
                                        INNER JOIN users users
                                          ON chats.volunteerid = users.id
                                     WHERE
                                        momId=$1 OR 
                                        volunteerId=$1
                                     ORDER BY lastMessageTime DESC`, 
                                       [userId]);
    return rows;
  }
  else if(role == 'Volunteer'){
    const rows = await executeQuery(`SELECT chats.id, chats.momid as "momId", chats.volunteerid as "volunteerId", chats.lastMessageTime as "lastMessageTime",
                                     users.firstName || ' ' || users.lastName as "otherName", users.profileLink as "otherProfileLink"
                                      FROM 
                                        chats chats
                                        INNER JOIN users users
                                          ON chats.momid = users.id
                                      WHERE
                                        momId=$1 OR 
                                        volunteerId=$1
                                      ORDER BY lastMessageTime DESC`, 
                                        [userId]);
    return rows;
  }
  else{
    return Promise.reject(new Error('Invalid role provided'));
  }
}

export const getMessageData = async (chatId: string) => {
  const rows = await executeQuery('SELECT id, chatid as "chatId", message, senderid as "senderId", datesent as "dateSent" FROM messages where chatId=$1', [chatId]);
  return rows;
  };

export const createMessage = async (chatId: string, senderId: string, message: string, dateSent: string) => {
  executeQuery('INSERT INTO messages (chatId, senderId, message, dateSent) VALUES ($1, $2, $3, $4)', [chatId, senderId, message, dateSent]);
  executeQuery('UPDATE chats SET lastMessageTime=$1 WHERE id=$2', [dateSent, chatId]);
}