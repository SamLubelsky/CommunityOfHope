import { executeQuery } from '../config/database'
const bcrypt = require('bcrypt')
import dotenv from 'dotenv'
dotenv.config()
//set nodeenv to development
process.env.NODE_ENV = 'development'

const args = process.argv.slice(2)
const user = args[0]
const password = args[1]
if (!user || !password) {
  console.log('Usage: node addUserManual.ts <username> <password>')
  process.exit(1)
}
const hashedPass = bcrypt.hashSync(password, 10)
async function addUser() {
  const newUser = await executeQuery(
    "INSERT INTO users (username, password, role) VALUES ($1, $2, 'Admin') RETURNING *",
    [user, hashedPass],
  )
  console.log(newUser)
}
addUser()
