import { Express, Request, Response } from 'express'
const express = require('express')
const dotenv = require('dotenv')
const bcrypt =require('bcrypt')
import userRoutes from './routes/userRoutes';
import helpRoutes from './routes/helpRoutes';

type UserRequest = {
  user: string
  password: string
}

dotenv.config()

const app: Express = express()
module.exports = app.listen(3000)
const port = process.env.PORT || 3000

const key = process.env.KEY
console.log(key)

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

export default app;

// if (require.main == module) {
//   app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`)
//   })
// }
