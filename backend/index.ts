import { Express, Request, Response } from 'express'
import { Server, Socket } from 'socket.io'
const express = require('express')
const session = require('express-session')
const dotenv = require('dotenv')
const bcrypt =require('bcrypt')
const cors = require('cors')
const SQLiteStore = require('connect-sqlite3')(session);
import userRoutes from './routes/userRoutes';
import helpRoutes from './routes/helpRoutes';
const http = require('http')

type UserRequest = {
  user: string
  password: string
}

dotenv.config()

const app = express()
app.use(session({
  store: new SQLiteStore(),
  secret: process.env.SESSION_SECRET || 'your_secret_key',  // Replace with a secure key
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7 //1 week
  }  // Set secure: true in production when using HTTPS
}));

app.use(cors({origin: ["http://localhost:8081", "http://localhost:5173"], credentials: true}));
app.use(express.json())
app.use('/api', userRoutes)
app.use('/api', helpRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.post('/', (req: Request, res: Response) => {
  const body = req.body as UserRequest

  const user = body.user

  const hashedPass = bcrypt.hashSync(body.password, 10)

  res.send({
    message: `Hello ${user}! Your hashed password is ${hashedPass}`,
  })
})

const port = process.env.PORT || 3001  // Change to 3001 or another available port
const httpServer = http.createServer(app)  
httpServer.listen(port)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8081", 
  }
});

export { io }; // Add this export

io.on('connection', (socket: Socket) => {
  console.log(`User ${socket.id} connected`)
  socket.on('chat message', (msg: string) => {
    console.log('message: ' + msg);
    io.emit('chat message', `${socket.id.substring(0,5)}: ${msg}`)
  });
}); 
export {app, httpServer};


// if (require.main == module) {
//   app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`)
//   })
// }
