import { Request, Response, NextFunction } from 'express';

// export const requireAuth = async (req: Request, res: Response, next: NextFunction, role: string): Promise<any> => {
//   if (!req.session || !req.session.userId || req.session.role !== role) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   next();
// };

export const requireAuth = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.session || !req.session.userId || req.session.role !== role) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };
};