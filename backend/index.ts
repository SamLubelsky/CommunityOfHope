import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

const key = process.env.KEY
console.log(key)

app.use(express.json())

type UserRequest = {
  user: string
  password: string
}

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
