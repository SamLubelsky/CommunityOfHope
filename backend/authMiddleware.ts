import { Request, Response, NextFunction } from 'express';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};