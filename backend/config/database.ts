import {Database} from 'sqlite3'

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
          category TEXT,
          request TEXT,
          FOREIGN KEY (mom_id) REFERENCES users(id)
        )
      `);
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          password TEXT
        )
      `);
        
    }
  });

// Drop existing table if needed
// db.run(`DROP TABLE IF EXISTS help_requests`);

// Create new table with updated schema

export default db;