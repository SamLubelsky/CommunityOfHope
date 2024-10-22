import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
      console.error('Failed to connect to the database');
    } else {
      console.log('Connected to the database');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
    )
  `);
  
  export default db;