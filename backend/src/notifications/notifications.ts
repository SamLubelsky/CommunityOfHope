import {Expo} from 'expo-server-sdk';
import { getPushTokens, getAllPushTokens, removePushToken, removePushTokenAllUsers } from '../models/notificationModel';
type NotificationMessage = {
    sound: string;
    body: string;
    data: any;      
}
const receiptStore = new Set<string>();

export const sendNotification = async(userId: string, data: NotificationMessage) => {
    sendNotifications([userId], data);
}
export const sendNotifications = async(userIds: string[], data: NotificationMessage): Promise<any> => {
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
                console.log("Removing token inside sendNotifications");
                await removePushToken(ticket.to, ticket.pushToken);
            }
        }
        if(ticket.status === "ok"){
            // receiptIds.push(ticket.id);
            receiptStore.add(ticket.id);
        }
    }
}

export const processReceipts = async () => {
    const expo = new Expo({ });
    // console.log("Processing receipts");
    // console.log("ReceiptStore:", receiptStore)
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(Array.from(receiptStore)); 
    for (const chunk of receiptIdChunks) {
        try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            // console.log(receipts);
            for(let receiptId in receipts){
                let {status, details} = receipts[receiptId];
                // console.log('ReciptId:', receiptId);
                // console.log("Status:", status);
                // console.log("Details:", details);
                if(status === 'ok'){
                    receiptStore.delete(receiptId);
                    continue;
                } else if(status === 'error'){
                    console.error('There was an error sending a notification: ', details);
                    if(details && typeof details === 'object' && 'error' in details){
                        if(details.error === 'DeviceNotRegistered'){
                            console.log("Removing token: ", details.expoPushToken);
                            await removePushTokenAllUsers(details.expoPushToken);
                        }                        
                    }
                    receiptStore.delete(receiptId);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}

setInterval(processReceipts, 1000 * 60 * 15) //process receipts every 15 minutes;