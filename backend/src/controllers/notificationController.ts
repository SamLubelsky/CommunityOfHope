import { Request, Response } from 'express'
import { getPushTokens, uploadPushToken } from '../models/notificationModel'
export const uploadToken = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const userId = req.session.userId
    const { pushToken } = req.body
    try {
      const tokens = await getPushTokens(userId)
      if (tokens.includes(pushToken)) {
        return res
          .status(200)
          .json({ message: 'Token already uploaded. No action taken.' })
      }
    } catch {} //if no token found, continue to upload
    await uploadPushToken(userId, pushToken)
    return res.status(201).json({ message: 'Token uploaded successfully' })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}
