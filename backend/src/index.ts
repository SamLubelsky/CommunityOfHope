import { Express, Request, Response } from 'express'
const express = require('express')
const session = require('express-session')
const dotenv = require('dotenv')
const bcrypt =require('bcrypt')
const cors = require('cors')
const SQLiteStore = require('connect-sqlite3')(session);
const functions = require('firebase-functions');
import userRoutes from './routes/userRoutes';
import helpRoutes from './routes/helpRoutes';
import chatRoutes from './routes/chatRoutes';
import {Server} from 'socket.io'
import { connected } from 'process'
import { getChatById } from './models/chatsModel'
import {createMessage} from './models/chatsModel'
import { createTables } from './config/setupDatabase'
import  {Pool} from 'pg'
import PgSimple from 'connect-pg-simple'
const http = require('http')

// createTables();
dotenv.config()
const app = express()

const isDevelopment = process.env.NODE_ENV == 'development'
if(isDevelopment){
  console.log("In Development Mode");
  app.use(cors({origin: ["http://localhost:8081", "http://localhost:5173"], credentials: true}));
} else{
  console.log("In Production Mode");
  app.set('trust proxy', true);
  app.use(cors({origin: ["https://fl24-community-of-hope.web.app","http://localhost:5173"], credentials: true}));
}

const pool = new Pool({
  host: process.env.DB_HOST || `/cloudsql/${process.env.DB_INSTANCE}`,
  user: process.env.DB_USER || 'quickstart-user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'coh-data',
  // ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false
})
const pgSession = PgSimple(session);
console.log(!isDevelopment);
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
app.use('/api', userRoutes)
app.use('/api', helpRoutes);
app.use('/api', chatRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

const port = process.env.LOCAL_PORT || 3000
const httpServer = http.createServer(app)  
if(isDevelopment){
  httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  }); 
} else{
  console.log("Not running server");
}
const io = new Server(httpServer,{
  cors:{
    // origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
    origin: "http://localhost:8081", 
  }
});
const connectedUsers = new Map();
io.on('connection', (socket) => {
  socket.on('idReady', ()=>{
    // console.log(`asking user ${socket.id} for id`);
    io.to(socket.id).emit('askId', socket.id);
  })  
  socket.on('disconnect', function(){
    // console.log(`User ${socket.id} disconnected`);
    connectedUsers.delete(socket.id);
  });
  socket.on('idResponse', id =>{
    connectedUsers.set(Number(id), socket.id)
    // console.log(`user with socketId ${socket.id} assosciated with id ${id}`)
  })
  socket.on('message', async (msg) => {
    // console.log("received message:",  msg);
    // console.log("connected users: ", connectedUsers);
    const {senderId, message, chatId} = msg;
    await createMessage(chatId, senderId, message, new Date().toISOString());
    // console.log("message saved to database");
    socket.to(socket.id).emit('messageReceived', msg);
    const chat = await getChatById(chatId);
    // console.log("chat: ", chat);
    if(chat){
      const {momId, volunteerId} = chat;
      if(senderId === momId && connectedUsers.has(volunteerId)){
        // console.log("sending message to volunteer");
        io.to(connectedUsers.get(volunteerId)).emit('message', msg);
      }
      if(senderId === volunteerId && connectedUsers.has(momId)){
        // console.log("sending message to mom");
        io.to(connectedUsers.get(momId)).emit('message', msg);
      }
    }
  });
}); 
app.get('/timestamp', (req: Request, res: Response) => {
  res.send(`${Date.now()}`);
});
exports.api = functions.https.onRequest(app);
// export {app};
// if (require.main == module) {
//   app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`)
//   })
// }