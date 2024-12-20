import db from '../config/database'
import {Chat} from '../utils/definitions'
export const getMessageData = (chatId: string) => {
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
export const getChatById = (chatId: number): Promise<Chat | null> => {
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
export const getChats = (userId: number, role: string): Promise<Chat[] | null> => {
  if(role == 'Mom'){
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
  if(role == 'Mom'){
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM chatIds where volunteerId=?', [userId], (err, rows) => {
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
    return Promise.reject(null);
  }

}
export const createChat = (volunteer_id: number, mom_id: number) => {
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