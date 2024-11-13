import { Request, Response } from 'express'
import { getAllUsers, createUser, findUserByUsername, deleteUserByUsername } from '../models/userModel'
const bcrypt = require('bcrypt')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

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
    res.status(201).json({ message: `User ${user} added` });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteUser = async(req: Request, res: Response) => {
  const { username } = req.params;
  try {
    await deleteUserByUsername(username);
    res.status(201).json({ message: `User ${username} deleted` });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const existingUser = await findUserByUsername(user);

    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    req.session.userId = existingUser.id;
    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
};