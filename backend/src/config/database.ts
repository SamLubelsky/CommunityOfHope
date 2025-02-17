import {Connector} from '@google-cloud/cloud-sql-connector'
import { Pool } from 'pg'
const dotenv = require('dotenv')
dotenv.config();
const instanceConnectionName = process.env.DB_INSTANCE || "fl24-community-of-hope:us-central1:coh-postgres";
const dbUser = process.env.DB_USER || "quickstart-user";
const dbPassword = process.env.DB_PASSWORD || "password";
const dbName = process.env.DB_NAME || "coh-data"; 
const connector = new Connector()
let pool: Pool;
type Value = string | number | boolean | string[];
const initializePool = async () => {
  if(!pool){
    const clientOpts = await connector.getOptions({
      instanceConnectionName
    });
    const dbConfig = {
      ...clientOpts,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    }
    pool = new Pool(dbConfig);
  }
} 

const executeQuery = async (query: string, values: Value[]) => {
    try {
      if(!pool) await initializePool();
      const client = await pool.connect();
      try{
        const res = await client.query(query, values);
        return res.rows; 
      } finally{
        client.release();
      }
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };
const createTables = async () => {
  await executeQuery(`
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
        )`,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS help_requests (
          id SERIAL PRIMARY KEY,
          mom_id INTEGER,
          volunteer_id INTEGER,
          description TEXT,
          emergency BOOLEAN DEFAULT FALSE,
          active BOOLEAN DEFAULT TRUE,
          dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
          FOREIGN KEY (mom_id) REFERENCES users(id) ON DELETE SET NULL,
          )
        `,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS chats (
          id SERIAL PRIMARY KEY,
          momId INTEGER,
          volunteerId INTEGER,
          dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          lastMessageTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (momId) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (volunteerId) REFERENCES users(id) ON DELETE SET NULL
          )
        `,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          chatId INTEGER,
          message TEXT, 
          senderId INTEGER,
          dateSent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (chatId) REFERENCES chatIds(id)
          )
        `,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS pushTokens (
          id SERIAL PRIMARY KEY,
          userId INTEGER,
          token TEXT,
          dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          )
        `,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS unclaimedHistory (
          id SERIAL PRIMARY KEY,
          helpId INTEGER,
          userId INTEGER,
          dateUnclaimed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (helpId) REFERENCES help_requests(id)
    )
  `,[]);
  //create session database for express-session
  await executeQuery(`CREATE TABLE IF NOT EXISTS session (
                      sid VARCHAR NOT NULL PRIMARY KEY,
                      sess JSON NOT NULL,
                      expire TIMESTAMP(6) NOT NULL
                      )
                      WITH (OIDS=FALSE);
                      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session ("expire");
  `,[]);
  
}
export {executeQuery, createTables};
