import { executeQuery } from "../config/setupDatabase";

export const uploadPushToken = async(userId: string, pushToken: string): Promise<any> => {
    await executeQuery('UPDATE users SET pushToken = $1 WHERE id = $2', [pushToken, userId]);
    return;
};

export const getPushToken = async(userId: string): Promise<string> => {
    const rows = await executeQuery('SELECT pushToken FROM users WHERE id=$1', [userId]);
    if(rows){
        return rows[0].pushToken;
    } else{
        return Promise.reject(new Error('User not found'));
    }
}