import {Expo} from 'expo-server-sdk';
import { getPushTokens, getAllPushTokens } from '../models/notificationModel';
type NotificationMessage = {
    sound: string;
    body: string;
    data: any;      
}
export const sendNotification = async(userId: string, data: NotificationMessage) => {
    sendNotifications([userId], data);
}
export const sendNotifications = async(userIds: string[], data: NotificationMessage) => {
    const expoPushTokens = await getAllPushTokens(userIds);

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

    let response = "";

    for (const ticket of tickets) {
        if (ticket.status === "error") {
            if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
                response = "DeviceNotRegistered";
            }
        }

        if (ticket.status === "ok") {
            response = ticket.id;
        }
    }

    return response;
}

const getReceipt = async (receiptId: string) => {
    const expo = new Expo({ });

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds([receiptId]);

    let receipt;

    for (const chunk of receiptIdChunks) {
        try {
            receipt = await expo.getPushNotificationReceiptsAsync(chunk);
        } catch (error) {
            console.error(error);
        }
    }

    return receipt ? receipt[receiptId] : null;
}