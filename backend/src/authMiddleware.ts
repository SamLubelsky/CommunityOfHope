import { Response, NextFunction } from 'express'
import { Request } from 'express-serve-static-core'
interface SessionData {
  userId: number
  role: string
}
const NODE_ENV = process.env.NODE_ENV
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  if (!req.session || !req.session.userId || !req.session.role) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}
export const requireMom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  if (
    !req.session ||
    !req.session.userId ||
    !req.session.role ||
    (req.session.role !== 'Mom' && req.session.role !== 'Admin')
  ) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}
export const requireVolunteer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  if (
    !req.session ||
    !req.session.userId ||
    !req.session.role ||
    (req.session.role !== 'Volunteer' && req.session.role !== 'Admin')
  ) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  if (
    !req.session ||
    !req.session.userId ||
    !req.session.role ||
    req.session.role !== 'Admin'
  ) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}
