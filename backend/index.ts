import { Express, Request, Response } from 'express'
import { Server, Socket } from 'socket.io'
const express = require('express')
const session = require('express-session')
const dotenv = require('dotenv')
const bcrypt =require('bcrypt')
const cors = require('cors')
import userRoutes from './routes/userRoutes';
import helpRoutes from './routes/helpRoutes';
const http = require('http')

type UserRequest = {
  user: string
  password: string
}

dotenv.config()

const app = express()
export { app }  // Add this line
app.set('trust proxy', 1)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',  // Replace with a secure key
  name: 'session',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set secure: true in production when using HTTPS
}));

app.use(cors());
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
export default httpServer;


// if (require.main == module) {
//   app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`)
//   })
// }
