import { Request, Response } from 'express'
import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import cors from 'cors'

import userRoutes from './routes/userRoutes'
import helpRoutes from './routes/helpRoutes'
import chatRoutes from './routes/chatRoutes'
import notificationRoutes from './routes/notificationRoutes'
import miscRoutes from './routes/miscRoutes'

import { createTables } from './config/database'
import { getDbName } from './config/utils'
import { Pool } from 'pg'
import PgSimple from 'connect-pg-simple'
import { initializeWebSocket } from './websocket'
import http from 'http'
import path from 'path'
import { createAdminUserIfNotExists } from './utils/functions'

dotenv.config()

createTables() //create database tables if they don't exist
createAdminUserIfNotExists()

const app = express()

const isDevelopment =
  process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test'

if (isDevelopment) {
  console.log('In Development Mode')
  app.use(
    cors({
      origin: ['http://localhost:8081', 'http://localhost:5176'],
      credentials: true,
    }),
  )
} else {
  console.log('In Production Mode')
  app.set('trust proxy', true)
  app.use(
    cors({
      origin: [
        'https://fl24-community-of-hope.web.app',
        'http://localhost:5176',
        'http://localhost:8081',
      ],
      credentials: true,
    }),
  )
}
const pool = new Pool({
  host: process.env.DB_HOST || `/cloudsql/${process.env.DB_INSTANCE}`,
  user: process.env.DB_USER || 'quickstart-user',
  password: process.env.DB_PASSWORD || 'password',
  database: getDbName(),

  // ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false
})
const pgSession = PgSimple(session)

const sessionMiddleware = session({
  store: new pgSession({
    pool,
    tableName: 'session',
  }),
  proxy: !isDevelopment,
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Replace with a secure key
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: !isDevelopment, // Set secure: true in production when using HTTPS
    sameSite: isDevelopment ? 'lax' : 'none',
    maxAge: 1000 * 60 * 60 * 24 * 90, //3 months
  },
})
app.use(sessionMiddleware)

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
// app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', userRoutes)
app.use('/api', helpRoutes)
app.use('/api', chatRoutes)
app.use('/api', notificationRoutes)
app.use('/api', miscRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

const port = process.env.PORT || 3000
const httpServer = http.createServer(app)
httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

initializeWebSocket(httpServer)
export { sessionMiddleware, app, httpServer }
