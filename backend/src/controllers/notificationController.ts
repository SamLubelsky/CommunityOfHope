import {Request, Response} from 'express';
import { uploadPushToken } from '../models/notificationModel';
export const uploadToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.session.userId;
    const { pushToken } = req.body;
    await uploadPushToken(userId, pushToken);
    return res.status(201).json({ message: 'Token uploaded successfully' });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
