import {Database} from 'sqlite3';
const bcrypt = require('bcrypt')
 
const args = process.argv.slice(2);
const user = args[0];
const password = args[1];

console.log(user);
console.log(password);
const hashedPass = bcrypt.hashSync(password, 10);
const db = new Database('database.db', (err) => {
    if (err) {
      console.error('Failed to connect to the database');
    } else {
      console.log('Connected to the database');
      db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [user, hashedPass], (err) => {
        if (err) {
          console.error('Failed to add user');
        } else {
          console.log('User added successfully');
        }
    });
    }
  });