import { Request, Response } from 'express'
import { getAllUsers, createUser } from '../models/userModel'

type UserRequest = {
  user: string
  password: string
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const addUser = async (req: Request, res: Response) => {
  const body = req.body as UserRequest;
  const user = body.user;
  const password = body.password;
  try {
    const newUserID = await createUser(user, password);
    res.json({ message: `User ${user} added with ID ${newUserID}` });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
