import { Request, Response } from 'express'
import { getMessageData, getChatById, createChat, createMessage } from '../models/chatsModel'
import {Chat} from '../utils/definitions';
//gets all chats for associated chat id
export const getMessages = async (req: Request, res: Response): Promise<any> =>{
    const {chatId} = req.params;
    const {userId, role} = req.session;
    console.log("userId: ", userId);
    console.log("chatId: ", chatId);
    try{
        const chat = await getChatById(Number(chatId));
        if(!chat){
            return res.status(400).json({message: 'Chat not found'});
        }
        const {momId, volunteerId} = chat;
        if(userId !== momId &&  userId !== volunteerId && role !== 'Admin'){
            console.log(req.session.userId);
            console.log(req.session.role);
            console.log(chat.volunteerId);
            console.log(chat.momId);
            console.log(chat.chatId);
            return res.status(401).json({message: 'You are unauthorized to view this chat'});
        }   
        const messages = await getMessageData(chatId);
        return res.status(200).json(messages);
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