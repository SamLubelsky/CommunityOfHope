import e from 'express';
import {executeQuery} from '../config/setupDatabase'
export const getSessionData = async () => {
    const rows = await executeQuery('SELECT * FROM session', []);
    return rows;
}
export const deleteSessionBySessionId = async (sessionId: string) => {
    executeQuery('DELETE FROM session WHERE sid=$1', [sessionId]);
}