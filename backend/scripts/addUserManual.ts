import {Database} from 'sqlite3';
const bcrypt = require('bcrypt')
 
const args = process.argv.slice(2);
const user = args[0];
const password = args[1];
const firstName = args[2];
const lastName = args[3];

console.log(user);
console.log(password);
const hashedPass = bcrypt.hashSync(password, 10);
const db = new Database('database.db', (err) => {
    if (err) {
      console.error('Failed to connect to the database');
    } else {
      console.log('Connected to the database');
      db.run(`INSERT INTO users (username, password, firstName, lastName) VALUES (?, ?, ?, ?)`, [user, hashedPass, firstName, lastName], (err) => {
        if (err) {
          console.error('Failed to add user');
          console.log(err);
        } else {
          console.log('User added successfully');
        }
    });
    }
  });