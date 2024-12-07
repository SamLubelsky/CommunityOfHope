import { Request, Response } from 'express'
import { getAllUsers, createUser, findUserByUsername, deleteUserById, findUserById, editUserInfo, getUserData} from '../models/userModel'
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
export const getUser = async (req: Request, res: Response): Promise<any> => {
  const {id} = req.params;

  try {
    const user = await getUserData(id);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
export const addUser = async (req: Request, res: Response): Promise<any> => {
  console.log("ADDING USER");
  const {user, password, firstName, lastName, role} = req.body;
  if (!user || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const newUserID = await createUser(user, password, firstName, lastName, role);
    return res.status(200).json({ message: `User ${user} added` });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
export const editUser = async(req: Request, res: Response): Promise<any> =>{
  const { id } = req.params;
  const {user, password, firstName, lastName, role} = req.body;
  try {
    const existingUser = await findUserById(id);
    if (!existingUser) {
      return res.status(400).json({ message: 'User not found' });
    }
    await editUserInfo(user, password, firstName, lastName, role, id);
    res.status(201).json({ message: `User ${user} updated` });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
export const deleteUser = async(req: Request, res: Response) => {
  console.log("DELETING USER");
  const { id } = req.params;
  try {
    await deleteUserById(id);
    res.status(201).json({ message: `User ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
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
      return res.status(405).json({ message: 'Invalid username or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(406).json({ message: 'Invalid username or password.' });
    }
    const id = existingUser.id;
    const firstName = existingUser.firstName;
    const lastName = existingUser.lastName;
    req.session.userId = existingUser.id;
    req.session.role = existingUser.role;
    return res.status(201).json({ message: 'Login successful', id, firstName, lastName });

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
    res.status(201).json({ message: 'Logout successful' });
  });
};