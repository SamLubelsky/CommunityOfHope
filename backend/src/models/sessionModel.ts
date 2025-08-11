import e from 'express'
import { executeQuery } from '../config/database'
export const getSessionData = async () => {
  const rows = await executeQuery('SELECT * FROM session', [])
  return rows
}
export const getUserIdFromSessionId = async (sessionId: string) => {
  const rows = await executeQuery('SELECT sess FROM session WHERE sid=$1', [
    sessionId,
  ])
  if (rows.length === 0) {
    return Promise.reject(new Error('Session not found'))
  }
  return rows[0].sess.userId
}
export const deleteSessionBySessionId = async (sessionId: string) => {
  executeQuery('DELETE FROM session WHERE sid=$1', [sessionId])
}
