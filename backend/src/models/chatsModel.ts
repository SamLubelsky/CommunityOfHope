import db from '../config/database'
import {Chat} from '../utils/definitions'
import {executeQuery} from '../config/setupDatabase'
export const getMessageData = (chatId: string) => {
  executeQuery('SELECT * FROM chats where chatId=$1', [chatId]);
  return;
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
  const rows = await executeQuery('SELECT * FROM chatIds where id=$1', [chatId]);
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
export const getChats = async (userId: string, role: string): Promise<Chat[] | null> => {
  if(role == 'Mom' || role=='Volunteer'){
    const rows = await executeQuery('SELECT * FROM chatIds where momId=$1 OR volunteerId=$1', [userId]);
    if(rows){
      return rows[0];
    } else{
      return Promise.reject(new Error('Chat not found'));
    }
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM chatIds where momId=?', [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else if(!rows){
            resolve(null);
        }else {
          resolve(rows as Chat[]);
        }
      });
    });
  }
  if(role == 'Admin'){
    const rows = await executeQuery('SELECT * FROM chatIds', []);
    if(rows){
      return rows[0];
    } else{
      return Promise.reject(new Error('Chat not found'));
    }
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM chatIds', (err, rows) => {
        if (err) {
          reject(err);
        } else if(!rows){
            resolve(null);
        }else {
          resolve(rows as Chat[]);
        }
      });
    });
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