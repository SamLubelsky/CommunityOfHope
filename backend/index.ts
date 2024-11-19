import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import helpRoutes from './routes/helpRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', helpRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
