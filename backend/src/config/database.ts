import { Pool } from 'pg'
import { getDbName } from './utils'
const dotenv = require('dotenv')
dotenv.config()

const instanceConnectionName =
  process.env.DB_INSTANCE || 'fl24-community-of-hope:us-central1:coh-postgres'
const dbUser = process.env.DB_USER || 'quickstart-user'
const dbPassword = process.env.DB_PASSWORD || 'password'
const dbName = getDbName()
// Use the same connection approach as your main app
const pool = new Pool({
  host: process.env.DB_HOST || `/cloudsql/${instanceConnectionName}`,
  user: dbUser,
  password: dbPassword,
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
const recreateTables = async () => {
  const client = await pool.connect()
  try {
    // Start an explicit transaction
    await client.query('BEGIN')

    // Drop all tables first to ensure clean state
    await client.query('DROP TABLE IF EXISTS messages CASCADE')
    await client.query('DROP TABLE IF EXISTS pushTokens CASCADE')
    await client.query('DROP TABLE IF EXISTS unclaimedHistory CASCADE')
    await client.query('DROP TABLE IF EXISTS chats CASCADE')
    await client.query('DROP TABLE IF EXISTS help_requests CASCADE')
    await client.query('DROP TABLE IF EXISTS locations CASCADE')
    await client.query('DROP INDEX IF EXISTS "IDX_session_expire"')
    await client.query('DROP TABLE IF EXISTS session CASCADE')
    await client.query('DROP TABLE IF EXISTS users CASCADE')

    // Now create all tables in the correct order
    await client.query(`
          CREATE TABLE users (
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

    await client.query(`
          CREATE TABLE help_requests (
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
          )
        `)

    await client.query(`
          CREATE TABLE chats (
          id SERIAL PRIMARY KEY,
          momId INTEGER,
          volunteerId INTEGER,
          dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          lastMessageTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (momId) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (volunteerId) REFERENCES users(id) ON DELETE SET NULL
          )
        `)

    await client.query(`
          CREATE TABLE messages (
          id SERIAL PRIMARY KEY,
          chatId INTEGER,
          message TEXT, 
          senderId INTEGER,
          dateSent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (chatId) REFERENCES chats(id)
          )
        `)

    await client.query(`
          CREATE TABLE pushTokens (
          id SERIAL PRIMARY KEY,
          userId INTEGER,
          token TEXT,
          dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          )
        `)

    await client.query(`
          CREATE TABLE unclaimedHistory (
          id SERIAL PRIMARY KEY,
          helpId INTEGER,
          userId INTEGER,
          dateUnclaimed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (helpId) REFERENCES help_requests(id)
    )
  `)

    await client.query(`CREATE TABLE session (
                      sid VARCHAR NOT NULL PRIMARY KEY,
                      sess JSON NOT NULL,
                      expire TIMESTAMP(6) NOT NULL
                      )
                      WITH (OIDS=FALSE)`)

    await client.query(
      `CREATE INDEX "IDX_session_expire" ON session ("expire")`,
    )

    await client.query(`CREATE TABLE locations (
    id SERIAL PRIMARY KEY,  
    origin_place_id TEXT NOT NULL,
    destination_place_id TEXT NOT NULL,
    travel_time_seconds INTEGER NOT NULL,
    UNIQUE (origin_place_id, destination_place_id)
  )`)

    // Commit the transaction - this makes all tables visible
    await client.query('COMMIT')
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
export { executeQuery, createTables, recreateTables }
