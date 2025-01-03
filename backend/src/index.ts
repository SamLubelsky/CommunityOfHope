import { Request, Response } from 'express'
import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes';
import helpRoutes from './routes/helpRoutes';
import chatRoutes from './routes/chatRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { createTables } from './config/setupDatabase'
import  {Pool} from 'pg'
import PgSimple from 'connect-pg-simple'
import { initializeWebSocket } from './websocket'
import http from 'http'
import path from 'path'
import bodyParser from 'body-parser'

createTables();
dotenv.config()
const app = express()

const isDevelopment = process.env.NODE_ENV == 'development'
if(isDevelopment){
  console.log("In Development Mode");
  app.use(cors({origin: ["http://localhost:8081", "http://localhost:5173"], credentials: true}));
} else{
  console.log("In Production Mode");
  app.set('trust proxy', true);
  app.use(cors({origin: ["https://fl24-community-of-hope.web.app","http://localhost:5173","http://localhost:8081"], credentials: true}));
}

const pool = new Pool({
  host: process.env.DB_HOST || `/cloudsql/${process.env.DB_INSTANCE}`,
  user: process.env.DB_USER || 'quickstart-user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'coh-data',
  // ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false
})
const pgSession = PgSimple(session);

app.use(session({
  store: new pgSession({
    pool,
    tableName: 'session'
  }),
  proxy: !isDevelopment,
  secret: process.env.SESSION_SECRET || 'your_secret_key',  // Replace with a secure key
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    secure: !isDevelopment,
    sameSite: isDevelopment ? 'lax' : 'none',
    // domain: isDevelopment ? 'localhost' : 'https://api-v4j57qn4oq-uc.a.run.app',
    // secure: !isDevelopment,
    maxAge: 1000 * 60 * 60 * 24 * 90, //3 months
  }  // Set secure: true in production when using HTTPS
}));


app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));
// app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', userRoutes)
app.use('/api', helpRoutes);
app.use('/api', chatRoutes);
app.use('/api', notificationRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

const port = process.env.PORT || 3000
const httpServer = http.createServer(app)  
httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
});
// if(isDevelopment){
//   httpServer.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`)
//   }); 
// } else{
//   console.log("Not running server");
// }
initializeWebSocket(httpServer);
// exports.api = functions.https.onRequest(app);
// export {app};
// if (require.main == module) {
//   app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`)
//   })
// }