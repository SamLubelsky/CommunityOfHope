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
          console.log("ERROR");
          reject(err);
        } else if(!rows){
            console.log("no rows");
            resolve(null);
        }else {
          console.log(rows[0]);
          resolve(rows[0] as Chat);
        }
      });
    });
}
export const createChat = (volunteer_id: string, mom_id: string) => {
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