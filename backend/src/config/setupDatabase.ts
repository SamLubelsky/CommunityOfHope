import {Connector} from '@google-cloud/cloud-sql-connector'
import { Pool } from 'pg'
const dotenv = require('dotenv')
dotenv.config();
const instanceConnectionName = process.env.db_instance || "fl24-community-of-hope:us-central1:coh-postgres";
const dbUser = process.env.db_user || "quickstart-user";
const dbPassword = process.env.db_password || "password";
const dbName = process.env.db_name || "coh-data"; 
const connector = new Connector()
let pool: Pool;

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

const executeQuery = async (query: string, values: string[]) => {
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
          dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )`,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS help_requests (
          id SERIAL PRIMARY KEY,
          mom_id INTEGER,
          volunteer_id INTEGER,
          description TEXT,
          request TEXT,
          active BOOLEAN DEFAULT TRUE,
          dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
          FOREIGN KEY (mom_id) REFERENCES users(id)
          )
        `,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS chatIds (
          id SERIAL PRIMARY KEY,
          momId INTEGER,
          volunteerId INTEGER,
          dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (momId) REFERENCES users(id),
          FOREIGN KEY (volunteerId) REFERENCES users(id)
          )
        `,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS chats (
          id SERIAL PRIMARY KEY,
          chatId INTEGER,
          message TEXT, 
          senderId INTEGER,
          dateSent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (senderId) REFERENCES users(id)
          )
        `,[]);
}
export {executeQuery, createTables};
