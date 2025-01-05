import {Response, NextFunction } from 'express';
import {Request} from 'express-serve-static-core'
interface SessionData {
  userId: number;
  role: string;
}

// export const requireAuth = async (req: Request, res: Response, next: NextFunction, role: string): Promise<any> => {
//   if (!req.session || !req.session.userId || req.session.role !== role) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   next();
// };

// export const requireAuth =  (role: string) => {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     const sessionData = req.session as SessionData;
//     if (!sessionData || !sessionData.userId || !sessionData.role) {
//       res.status(401).json({ message: 'Unauthorized' });
//       return;
//     } else if(role == 'admin' && sessionData.role !== 'admin') {
//       res.status(401).json({ message: 'Unauthorized' });
//     } 
//     next();
//   };
// };
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  if (!req.session || !req.session.userId || !req.session.role) {
    return res.status(401).json({ message: 'Unauthorized'});
  }
  next();
};
export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  if (!req.session || !req.session.userId || !req.session.role || req.session.role !== 'Admin') {
    return res.status(401).json({ message: 'Unauthorized'});
  }
  next();
};