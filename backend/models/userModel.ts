import db from '../config/database'
import { validateUserInput } from '../utils/functions'
const bcrypt = require('bcrypt')

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username FROM users', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
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

export const createUser = async (username: string, password: string) => {
  const validationError = validateUserInput({ user: username, password });
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
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPass],
      function (err) {
        if (err || validateUserInput({ user: username, password }) != null) {
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