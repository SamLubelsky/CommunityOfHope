import {Expo} from 'expo-server-sdk';
import { getPushToken } from '../models/notificationModel';
type NotificationMessage = {
    sound: string;
    body: string;
    data: any;      
}
export const sendNotification = async(userId: string, data: NotificationMessage) => {
    const expoPushToken = await getPushToken(userId);

    const expo = new Expo({})

    const chunks = expo.chunkPushNotifications([{ to: expoPushToken, ...data }]);
    const tickets = [];
    console.log("chunks", chunks);
    console.log("Data to send:", { to: expoPushToken, ...data });
    console.log("expoPustToken", expoPushToken);
    console.log("Data:", data);
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