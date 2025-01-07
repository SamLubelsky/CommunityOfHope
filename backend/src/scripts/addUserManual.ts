import {Database} from 'sqlite3';
const bcrypt = require('bcrypt')
 
const args = process.argv.slice(2);
const user = args[0];
const password = args[1];
const firstName = args[2];
const lastName = args[3];