import {Connector} from '@google-cloud/cloud-sql-connector'
import { database } from 'firebase-admin'
import { Pool } from 'pg'

const instanceConnectionName = "fl24-community-of-hope:us-central1:coh-postgres"
const dbUser = "quickstart-user"
const dbPassword = "Sara6162816357492"
const dbName = "coh-data"
async function connectToCloudSQL(){
    const connector = new Connector();
    const clientOpts = await connector.getOptions({
        instanceConnectionName
    });
    const dbConfig = {
        ...clientOpts,
        user: dbUser,
        password: dbPassword,
        database: dbName,
    }
    return new Pool(dbConfig);
}

const executeQuery = async (query: string, values: string[]) => {
    try {
      const pool = await connectToCloudSQL();
  
      // Test the connection
      const client = await pool.connect();
      const res = await client.query(query, values);
      return res.rows;
      client.release();
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error);
      return;
    }
  };
const createTables = async () => {
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY ,
          username TEXT,
          password TEXT,
          firstName TEXT,
          lastName TEXT,
          role TEXT
        )`,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS help_requests (
          id SERIAL PRIMARY KEY,
          mom_id INTEGER,
          volunteer_id INTEGER,
          description TEXT,
          request TEXT,
          active BOOLEAN DEFAULT TRUE, 
          FOREIGN KEY (mom_id) REFERENCES users(id)
          )
        `,[]);
  await executeQuery(`
          CREATE TABLE IF NOT EXISTS chatIds (
          id SERIAL PRIMARY KEY,
          momId INTEGER,
          volunteerId INTEGER,
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
