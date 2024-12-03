import {Database} from 'sqlite3';

const db = new Database('database.db', (err) => {
    if (err) {
      console.error('Failed to connect to the database');
    } else {
      console.log('Connected to the database');
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          console.error('Error enabling foreign keys:', err.message);
        } else {
          console.log('Foreign key support enabled');
        }
      });
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
        CREATE TABLE IF NOT EXISTS chatIds (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          momId INTEGER,
          volunteerId INTEGER,
          FOREIGN KEY (momId) REFERENCES users(id),
          FOREIGN KEY (volunteerId) REFERENCES users(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS chats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chatId INTEGER,
          message TEXT, 
          senderId INTEGER,
          dateSent DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (senderId) REFERENCES users(id)
        )
      `);
    }
  });

// Drop existing table if needed
// db.run(`DROP TABLE IF EXISTS help_requests`);

// Create new table with updated schema

export default db;