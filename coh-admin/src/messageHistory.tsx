import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';
type Message = {
    id: string;
    content: string;
    senderName: string;
    message: string;
}
export default function MessageHistory() {
    //get chat id from URL params
    const { chatId } = useParams<{ chatId: string }>();
    
    // State to hold messages
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        console.log("Fetching messages for chatId:", chatId);
        async function fetchMessages() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}/messages`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch messages');
                }
                const messages = await response.json();
                const chatResponse = await fetch(`${BACKEND_URL}/api/chats/${chatId}/info`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch chat info');
                }
                const chatInfo = await chatResponse.json();
                console.log("Chat info:", chatInfo);
                console.log("Fetched messages:", messages);
                const enrichedMessages = messages.map((message: any) => {
                    if(message.senderId === chatInfo.momId) {
                        return {...message, senderName: chatInfo.momName};
                    }
                    if(message.senderId === chatInfo.volunteerId) {
                        return {...message, senderName: chatInfo.volName};
                    }
                    return message;
                });
                console.log("Enriched messages:", enrichedMessages);
                setMessages(enrichedMessages);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            }
        }
        if(!messages){
            fetchMessages();
        }
    }, []);
    function MessageDisplay(message: Message, index: number) {
        return (
            <div key={`message-${index}`} className="p-4 border-b border-gray-200">
                <p className="text-lg font-semibold text-gray-800">{message.senderName}</p>
                <p className="text-lg text-gray-600">{message.message}</p>
            </div>
        );
    }
    return (
        <>
        {messages?.map((message: Message, index) => MessageDisplay(message, index))}
        </>
    );
}