import { Request, Response } from 'express'
import { getAllUsers, createUser, findUserByUsername } from '../models/userModel'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
    res.status(201).json({ message: `User ${user} added with ID ${newUserID}` });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { user, password } = req.body;

  // Step 1: Validate the input
  if (!user || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Step 2: Check if the user exists in the database
    const existingUser = await findUserByUsername(user);

    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Step 3: Compare the password with the hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Step 4: Generate a JWT token
    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username },
      JWT_SECRET,
      { expiresIn: '1h' }  // Token expiry time
    );

    // Step 5: Return the token
    return res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};
