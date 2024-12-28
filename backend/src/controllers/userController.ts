import { Request, Response } from 'express'
import { getAllUsers, createUser, findUserByUsername, deleteUserById, editUserInfo, getUserData} from '../models/userModel'
import { verifySessionRequest } from '../utils/functions';
const bcrypt = require('bcrypt')


export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await getAllUsers();
    return res.status(201).json({users: users});
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
    const existingUser = await getUserData(id);
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
export const verifySession = async (req: Request, res: Response): Promise<any> => {
  if(!verifySessionRequest(req)){
    return res.status(400).json({message: 'Session could not be verified'});
  }
  const { userId, role } = req.session;
  const userData = await getUserData(String(userId));
  const {firstName, lastName} = userData;
  return res.status(201).json({ message: 'Session verified', userId, firstName, lastName, role});
};
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const existingUser = await findUserByUsername(user);
    if (!existingUser) {
      return res.status(401).json({ message: `No account with username ${user} exists`});
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const {id, firstName, lastName, role} = existingUser;
    req.session.userId = id;
    req.session.role = existingUser.role;
    console.log("Session Id:", req.sessionID);
    return res.status(201).json({ message: 'Login successful', id, firstName, lastName, role});
    // req.session.userId = id;
    // req.session.role = existingUser.role;
    // console.log('Session created:', req.session);
    // console.log('Headers being sent:', res.getHeaders());
    // // const token = 'test-token';
    // // res.setHeader('Set-Cookie', `session=${token}; Path=/; Secure; HttpOnly; SameSite=None`);
    // req.session.save((err: any) => {
    //   if (err) {
    //     return res.status(500).json({ message: 'Error saving session', error: err.message });
    //   }
    //   // res.send(req.session.sessionID);
    //   console.log(req.session.sessionId);
    //   console.log('Session created:', req.session);
    //   console.log('Headers being sent:', res.getHeaders());
    //   return res.status(201).json({ message: 'Login successful', id, firstName, lastName, role});
    // });

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