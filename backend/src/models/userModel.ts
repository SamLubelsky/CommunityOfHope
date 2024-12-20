import db from '../config/database'
import { validateUserInput } from '../utils/functions'
import {User} from "../utils/definitions"
const bcrypt = require('bcrypt')

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username, firstName, lastName, role FROM users', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
export const getUserData = (id: number): Promise<User> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username, firstName, lastName, role FROM users where id=?', [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0] as User);
      }
    });
  });
};

export const findUserByUsername = (username: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE username = ?'; 
    db.get(query, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(null);
      } else {
        resolve(row);
      }
    });
  });
};
export const findUserById = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?'; 
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(null);
      } else {
        resolve(row);
      }
    });
  });
};
export const editUserInfo = async(username: string, password: string, firstName: string, lastName: string, role: string, id:string) => {
  const validationError = validateUserInput({ user: username, password, firstName, lastName, role });
  if(validationError){
    return Promise.reject(new Error(validationError));
  }
  const existingUser = await findUserById(id);
  if(!existingUser){
    return Promise.reject(new Error('User not found in database, try adding a user instead'));
  }
  const hashedPass = bcrypt.hashSync(password, 10);
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE Users SET username=?, password=?, firstName=?, lastName=? role=? WHERE id=?',
      [username, hashedPass, firstName, lastName, role, id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
}
export const createUser = async (username: string, password: string, firstName: string, lastName: string, role: string) => {
  const validationError = validateUserInput({ user: username, password, firstName, lastName, role });
  if (validationError) {
    return Promise.reject(new Error(validationError));
  }

  const existingUser = await findUserByUsername(username); 
  if (existingUser) {
    return Promise.reject(new Error('Username already exists'));
  }
  
  const hashedPass = bcrypt.hashSync(password, 10);
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPass, firstName, lastName, role],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
};

export const deleteUserByUsername = (username: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM users WHERE username = ?';
    db.run(query, [username], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
export const deleteUserById = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM users WHERE id = ?';
    db.run(query, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};