import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import userRoutes from './routes/userRoutes';

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

const key = process.env.KEY
console.log(key)

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.get('/users', (req: Request, res: Response) => {
  db.all('SELECT id, username FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/', (req: Request, res: Response) => {
  const body = req.body as UserRequest

  const user = body.user

  const hashedPass = bcrypt.hashSync(body.password, 10)

  res.send({
    message: `Hello ${user}! Your hashed password is ${hashedPass}`,
  })
})

app.post('/users', (req: Request, res: Response) => {
  const body = req.body as UserRequest;
  const user = body.user;
  const hashedPass = bcrypt.hashSync(body.password, 10);

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.run(query, [user, hashedPass], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.send({
      message: `User ${user} added with ID ${this.lastID}`,
    });
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
