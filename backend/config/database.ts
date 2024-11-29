import {Database} from 'sqlite3';

const db = new Database('database.db', (err) => {
    if (err) {
      console.error('Failed to connect to the database');
    } else {
      console.log('Connected to the database');
      db.run(`
        CREATE TABLE IF NOT EXISTS help_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          mom_id INTEGER,
          mom_name TEXT,
          description TEXT,
          request TEXT,
          FOREIGN KEY (mom_id) REFERENCES users(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          password TEXT,
          firstName TEXT,
          lastName TEXT,
          role TEXT
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS chatIds (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          momId INTEGER,
          volunteerId INTEGER
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS chats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chatId INTEGER,
          message TEXT, 
          senderId INTEGER,
          dateSent DATETIME DEFAULT CURRENT_TIMESTAMPm
          FOREIGN KEY (sender_id) REFERENCES users(id)
        )
      `);
    }
  });

// Drop existing table if needed
// db.run(`DROP TABLE IF EXISTS help_requests`);

// Create new table with updated schema

export default db;