import { Request, Response } from 'express'
import { getMessageData, getChatById, createChat, createMessage } from '../models/chatsModel'
import {Chat} from '../utils/definitions';
//gets all chats for associated chat id
export const getMessages = async (req: Request, res: Response): Promise<any> =>{
    const {volunteerId, momId} = req.params;
    try{
        const chat = await getChatById(volunteerId, momId);
        if(!chat){
            return res.status(400).json({message: 'Chat not found'});
        }
        const chatId = chat.chatId;
        const chats = await getMessageData(chatId);
        return res.status(201).json(chats);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
}
export const sendChat = async(req: Request, res: Response): Promise<any> =>{
    const {chatId, senderId, message} = req.body;
    const dateSent = new Date().toISOString();
    try{
        await createMessage(chatId, senderId, message, dateSent);
        return res.status(201).json({message: 'Message sent'});
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
}