import {Expo} from 'expo-server-sdk';
import { getPushTokens, getAllPushTokens, removePushToken, removePushTokenAllUsers } from '../models/notificationModel';
type NotificationMessage = {
    sound: string;
    body: string;
    data: any;      
}
export const sendNotification = async(userId: string, data: NotificationMessage) => {
    sendNotifications([userId], data);
}
export const sendNotifications = async(userIds: string[], data: NotificationMessage): Promise<string[]> => {
    let expoPushTokens;
    try{
        expoPushTokens = await getAllPushTokens(userIds);
    } catch(error){
        console.error(error);
        return;
    }

    const expo = new Expo({})
    const chunks = expo.chunkPushNotifications(expoPushTokens.map(token => ({ to: token, ...data })));
    const tickets = [];
    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }

    let receiptIds = [];
    for (const ticket of tickets) {
        if (ticket.status === "error") {
            if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
                await removePushToken(ticket.to, ticket.pushToken);
            }
        }
        if(ticket.status === "ok"){
            receiptIds.push(ticket.id);
        }
    }

    return receiptIds;
}

export const processReceipts = async (receiptIds: string[]) => {
    const expo = new Expo({ });
    console.log("Processing receipts");
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds); 
    for (const chunk of receiptIdChunks) {
        try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            console.log(receipts);
            for(let receiptId in receipts){
                let {status, details} = receipts[receiptId];
                if(status === 'ok'){
                    continue;
                } else if(status === 'error'){
                    console.error('There was an error sending a notification: ', details);
                    if(details && typeof details === 'object' && 'error' in details){
                        if(details.error === 'DeviceNotRegistered'){
                            console.log("Removing token: ", details.expoPushToken);
                            await removePushTokenAllUsers(details.expoPushToken);
                        }                        
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}