import { Request, Response } from 'express'
import { Multer } from 'multer';
import { getAllUsers, createUser, findUserByUsername, deleteUserById, editUserInfo, getUserData} from '../models/userModel'
import { verifySessionRequest } from '../utils/functions';
import { User } from '../utils/definitions';
import {deleteSessionBySessionId, getSessionData} from '../models/sessionModel'
import fs from 'fs';
import session from 'express-session';
import path from 'path';
import { removePushToken } from '../models/notificationModel';
const bcrypt = require('bcrypt')

interface MulterRequest extends Request {
  file?: Multer.File;
}
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
    const username = await getUserData(id);
    return res.status(201).json(username);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export const addUser = async (req: MulterRequest, res: Response): Promise<any> => {
  const {username, password, firstName, lastName, role} = req.body;
  const profilePic = req.file;
  const profilePath = '/images/' + path.basename(profilePic.path);
  if (!username || !password) {
    fs.unlink(profilePic.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const newUserID = await createUser(username, password, firstName, lastName, role, profilePath);
    return res.status(200).json({ message: `User ${username} added` });
  } catch (error) {
    fs.unlink(profilePic.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    return res.status(500).json({ message: (error as Error) });
  }
};
export const editUser = async(req: MulterRequest, res: Response): Promise<any> =>{
  const { id } = req.params;
  const {username, password, firstName, lastName, role} = req.body;
  const profilePic = req.file;
  const profilePath = '/images/' + path.basename(profilePic.path);
  try {
    const existingUser = await getUserData(id);
    if (!existingUser) {
      fs.unlink(profilePic.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
      return res.status(400).json({ message: 'User not found' });
    }
    fs.unlink(path.join(__dirname, `../../public/${existingUser.profileLink}`), (err) => {
      if (err) console.error("Error deleting file:", err);
    }); 
    await editUserInfo(username, password, firstName, lastName, role, id, profilePath);
    res.status(201).json({ message: `User ${username} updated` });
  } catch (error) {
    fs.unlink(profilePic.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
    res.status(500).json({ message: (error as Error).message });
  }
}
export const deleteUser = async(req: Request, res: Response) => {
  console.log("DELETING USER");
  const { id } = req.params;
  try {
    await deleteUserById(id);
    const sessionData = await getSessionData();
    sessionData.forEach((session) =>{
      // console.log("Session:", session);
      // console.log("id:", id);
      // console.log("id stored in session:", session.sess.userId);
      if(session.sess.userId == id){
        deleteSessionBySessionId(session.sid);
        console.log("Session deleted:", session.sid);
      }
    })
    res.status(201).json({ message: `User ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  } 
}
export const verifySession = async (req: Request, res: Response): Promise<any> => {
  if(!req.session || !req.session.userId || !req.session.role){
    return res.status(400).json({message: 'Session could not be verified'});
  }
  const { userId, role } = req.session;
  const userData = await getUserData(String(userId));
  if(!userData){
    return res.status(400).json({message: 'Session could not be verified'});
  }
  const {firstName, lastName} = userData;
  return res.status(201).json({ message: 'Session verified', userId, firstName, lastName, role});
};
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const existingUser = await findUserByUsername(username);
    if (!existingUser) {
      return res.status(401).json({ message: `No account with username ${username} exists`});
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
  const { userId } = req.session;
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.clearCookie('connect.sid');
      const { expoPushToken } = req.body;
      console.log("body:", req.body);
      console.log("Expo Push Token:", expoPushToken);
      console.log("User Id:", userId);
      if(expoPushToken){
        removePushToken(userId, expoPushToken);
      }
      res.status(201).json({ message: 'Logout successful' });
    });
};