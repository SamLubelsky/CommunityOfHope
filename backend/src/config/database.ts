import { Pool } from 'pg'
import { getDbName } from './utils'
const dotenv = require('dotenv')
dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'
const dbUser = process.env.DB_USER || 'quickstart-user'
const dbPassword = process.env.DB_PASSWORD || 'password'
const dbName = getDbName()
const host = process.env.DB_HOST || 'localhost'
console.log(`dbUser: ${dbUser}`)
console.log(`dbPassword: ${dbPassword}`)
console.log(`dbName: ${dbName}`)
console.log(`host: ${host}`)
// Use the same connection approach as your main app
const pool = new Pool({
  host: host,
  user: dbUser,
  password: isProduction ? dbPassword : undefined,
  database: dbName,
})

type Value = string | number | boolean | string[]

const executeQuery = async (query: string, values: Value[]) => {
  try {
    const client = await pool.connect()
    try {
      const res = await client.query(query, values)
      return res.rows
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error executing query:', error)
    throw error
  }
}
const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    password TEXT,
    firstName TEXT,
    lastName TEXT,
    role TEXT,
    profileLink TEXT,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pushToken TEXT DEFAULT NULL
  )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS help_requests (
    id SERIAL PRIMARY KEY,
    mom_id INTEGER,
    volunteer_id INTEGER,
    description TEXT,
    emergency BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    placeId TEXT DEFAULT NULL,
    placeName TEXT DEFAULT NULL,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (mom_id) REFERENCES users(id) ON DELETE SET NULL
  )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    momId INTEGER,
    volunteerId INTEGER,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastMessageTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (momId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (volunteerId) REFERENCES users(id) ON DELETE SET NULL
  )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chatId INTEGER,
    message TEXT, 
    senderId INTEGER,
    dateSent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (chatId) REFERENCES chats(id)
  )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pushTokens (
    id SERIAL PRIMARY KEY,
    userId INTEGER,
    token TEXT,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS unclaimedHistory (
    id SERIAL PRIMARY KEY,
    helpId INTEGER,
    userId INTEGER,
    dateUnclaimed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (helpId) REFERENCES help_requests(id)
  )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    origin_place_id TEXT NOT NULL,
    destination_place_id TEXT NOT NULL,
    travel_time_seconds INTEGER NOT NULL,
    UNIQUE (origin_place_id, destination_place_id)
  )`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
  )`)
}
const deleteFromTables = async () => {
  await pool.query(
    'TRUNCATE TABLE users, help_requests, chats, messages, pushTokens, unclaimedHistory, session RESTART IDENTITY',
  )
}

export { executeQuery, createTables, deleteFromTables }
