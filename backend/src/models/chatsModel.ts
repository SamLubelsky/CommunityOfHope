import db from '../config/database'
import {Chat} from '../utils/definitions'
import {executeQuery} from '../config/setupDatabase'
export const getMessageData = (chatId: string) => {
  const rows = executeQuery('SELECT id, chatid as "chatId", message, senderid as "senderId", datesent as "dateSent" FROM chats where chatId=$1', [chatId]);
  return rows;
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM chats where chatId=?', [chatId], (err, rows) => {
        if (err) {
          reject(err);
        } else if(!rows){
          resolve(null);
        }else {
          resolve(rows);
        }
      });
    });
  };
export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const rows = await executeQuery('SELECT id, momid as "momId", volunteerid as "volunteerId" FROM chatIds where id=$1', [chatId]);
  if(rows){
    return rows[0];
  } else{
    return Promise.reject(new Error('Chat not found'));
  }
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM chatIds where id=?', [chatId], (err, rows) => {
        if (err) {
          reject(err);
        } else if(!rows){
            resolve(null);
        }else {
          resolve(rows[0] as Chat);
        }
      });
    });
}
export const getChat = async(momId: string, volunteerId: string): Promise<Chat | null> => {
  const rows = await executeQuery('SELECT id, momid as "momId", volunteerid as "volunteerId" FROM chatIds where momId=$1 AND volunteerId=$2', [momId, volunteerId]);
  if(rows.length === 0){
    return Promise.reject(new Error('Chat not found'));
  }
  return rows[0];
}
export const getChats = async (userId: string, role: string): Promise<Chat[] | null> => {
  if(role == 'Mom'){
    const rows = await executeQuery(`SELECT chats.id, chats.momid as "momId", chats.volunteerid as "volunteerId", users.firstName || ' ' || users.lastName as "otherName"
                                     FROM 
                                        chatIds chats
                                        INNER JOIN users users
                                          ON chats.volunteerid = users.id
                                     WHERE
                                        momId=$1 OR 
                                        volunteerId=$1`, 
                                       [userId]);
    return rows;
  }
  else if(role == 'Volunteer'){
    const rows = await executeQuery(`SELECT chats.id, chats.momid as "momId", chats.volunteerid as "volunteerId", users.firstName || ' ' || users.lastName as "otherName"
      FROM 
         chatIds chats
         INNER JOIN users users
           ON chats.momid = users.id
      WHERE
         momId=$1 OR 
         volunteerId=$1`, 
        [userId]);
    return rows;
  }
  if(role == 'Admin'){
    const rows = await executeQuery(`SELECT chats.id, chats.momid as "momId", chats.volunteerid as "volunteerId", users.firstName || ' ' || users.lastName as "otherName"
      FROM 
         chatIds chats
         INNER JOIN users users
           ON chats.volunteerid = users.id
      WHERE
         momId=$1 OR 
         volunteerId=$1`, 
        [userId]);
    return rows;
  } else{
    return Promise.reject(new Error('Invalid role provided'));
  }

}
export const createChat = (volunteer_id: string, mom_id: string) => {
  executeQuery('INSERT INTO chatIds (volunteerId, momId) VALUES ($1, $2)', [volunteer_id, mom_id]);
  return;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO chatIds (volunteerId, momId) VALUES (?, ?)',
        [volunteer_id, mom_id],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
}
export const createMessage = (chatId: string, senderId: string, message: string, dateSent: string) => {
  executeQuery('INSERT INTO chats (chatId, senderId, message, dateSent) VALUES ($1, $2, $3, $4)', [chatId, senderId, message, dateSent]);
  return;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO chats (chatId, senderId, message, dateSent) VALUES (?, ?, ?, ?)',
        [chatId, senderId, message, dateSent],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
}