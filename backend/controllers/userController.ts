import { Request, Response } from 'express'
import { getAllUsers, createUser, findUserByUsername, deleteUserByUsername } from '../models/userModel'
const bcrypt = require('bcrypt')

type UserRequest = {
  user: string
  password: string
}

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await getAllUsers();
    return res.status(201).json(users);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const addUser = async (req: Request, res: Response): Promise<any> => {
  console.log("ADDING USER");
  const {user, password, firstName, lastName} = req.body;
  if (!user || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const newUserID = await createUser(user, password);
    return res.status(201).json({ message: `User ${user} added` });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteUser = async(req: Request, res: Response) => {
  console.log("DELETING USER");
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
    const id = existingUser.id;
    const firstName = existingUser.firstName;
    const lastName = existingUser.lastName;
    req.session.userId = existingUser.id;
    return res.status(200).json({ message: 'Login successful', id, firstName, lastName });

  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
    req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
};