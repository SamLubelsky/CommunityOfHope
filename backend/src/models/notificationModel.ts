import { executeQuery } from "../config/database";

export const uploadPushToken = async(userId: string, pushToken: string): Promise<any> => {
    await executeQuery('INSERT INTO pushTokens (userId, token) VALUES ($1, $2)', [userId, pushToken]);
    return;
};

export const getPushTokens = async(userId: string): Promise<string[]> => {
    const rows = await executeQuery('SELECT token as "pushToken" FROM pushTokens WHERE userId = $1', [userId]);
    if(rows.length > 0){
        return rows.map((row: any) => row.pushToken);
    } else{
        return Promise.reject(new Error('No token found for the provided user'));
    }
}
export const getAllPushTokens = async(userIds: string[]): Promise<string[]> => {
    const rows = await executeQuery('SELECT token as "pushToken" FROM pushTokens WHERE userId = ANY($1)', [userIds]);
    if(rows.length > 0){
        return rows.map((row: any) => row.pushToken);
    } else{
        return Promise.reject(new Error('No tokens found for any of the provided users'));
    }
}
export const removePushToken = async(userId: string, pushToken: string): Promise<void> => {
    await executeQuery('DELETE FROM pushTokens WHERE userId = $1 AND token = $2', [userId, pushToken]);
    return;
}
export const removePushTokenAllUsers = async(pushToken: string): Promise<void> => {
    await executeQuery('DELETE FROM pushTokens WHERE token = $1', [pushToken]);
    return;
}