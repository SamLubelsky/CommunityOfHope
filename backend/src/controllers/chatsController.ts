import { Request, Response } from 'express'
import { getMessageData, getChatById, createChat, createMessage, getChats, getChatRoomMessages, getChatByIdWithName } from '../models/chatsModel'
import {Chat} from '../utils/definitions';
import { getAllUsers, getUserData } from '../models/userModel';
//gets all chats for associated chat id
export const getMessages = async (req: Request, res: Response): Promise<any> =>{
    const {chatId} = req.params;
    const {userId, role} = req.session;
    try{
        if(chatId === "-1"){
            const messages = await getChatRoomMessages();
            return res.status(200).json({messages: messages, otherName: 'Volunteer Chat Room', otherProfileLink: ''});
        }
        const chat = await getChatByIdWithName(chatId, userId);
        if(!chat){
            return res.status(400).json({error: 'Chat not found'});
        }
        const {momId, volunteerId} = chat;
        if(userId !== momId &&  userId !== volunteerId && role !== 'Admin'){
            return res.status(401).json({error: 'You are unauthorized to view this chat'});
        }   
        const messages = await getMessageData(chatId);
        return res.status(200).json({messages: messages, ...chat});
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
export const getAllChats = async (req: Request, res: Response): Promise<any> =>{
    if(!req.session || !req.session.userId || !req.session.role){
        return res.status(401).json({error: 'You are not logged in'});
    }
    const {userId, role} = req.session;
    try{
        const chats = await getChats(userId, role);
        return res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: (error as Error).message });
    }
}
export const getChat = async (req: Request, res: Response): Promise<any> =>{
    const {chatId} = req.params;
    const {userId} = req.session;
    try{
        const chat = await getChatByIdWithName(chatId, userId);
        return res.status(200).json(chat);
    } catch(error){
        return res.status(500).json({ error: (error as Error).message });
    }
}
