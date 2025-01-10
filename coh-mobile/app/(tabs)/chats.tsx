import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import MyButton from '@/components/MyButton';
import { router } from 'expo-router'
import { BACKEND_URL } from '../config';
import {Chat} from '../../types';
import {useIsFocused} from '@react-navigation/native';
import { useBoundStore } from '@/store/useBound';
export default function Chats(){
    const isFocused = useIsFocused();
    const [chats, setChats] = useState<Chat[]>([]);

    const role = useBoundStore((state) => state.role);
    useEffect(() => {
        console.log("role:", role);
        const loadChats = async () => {
            const response = await fetch(`${BACKEND_URL}/api/chats`, {
                method: 'GET',
                credentials: 'include',
            });
            const responseData = await response.json();
            setChats(responseData);
            console.log(responseData);
            return responseData;
        }
        loadChats();
    }, [isFocused]);
    async function onSubmit(id: Number){
        const selectedChat = chats.filter(chat => chat.chatId === id)[0];
        const chatsResorted = [selectedChat, ...chats.filter(chat => chat.chatId !== id)];
        // setChats(chatsResorted);
        router.push(`/chats/${id}`);
    }

    function getChatsList(){
        if(chats.length === 0 && role === "Mom"){
            return <Text style={styles.helpText}> You don't have any chats open yet</Text>
        }
        const chatsList = chats.map((chat: any, index: any) => {   
            return (
                <View key={index} className="w-full items-center justify-center border-2 border-blue-300 rounded-md bg-gray-200 px-6 py-3 mt-4">
                    <Text className="text-blue-600 text-6 mb-3 font-5"> {chat.otherName}</Text>
                    <Pressable className="py-2 px-4 mt-3 bg-blue-200 border self-center rounded-md border-none" onPress={()=>onSubmit(chat.id)}>
                        <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">Open Chat</Text>
                    </Pressable>
                </View>
            )});
        if(role === "Volunteer" || role === "Admin"){
            const chatRoomChat =         
            (
            <View key="chatRoom" className="items-center justify-center border-2 border-blue-300 rounded-md bg-gray-200 px-6 py-3">
                <Text className="text-blue-600 text-6 mb-3 font-5"> Volunteer Chat Room</Text>
                <Pressable className="py-2 px-4 mt-3 bg-blue-200 border self-center rounded-md border-none" onPress={()=>onSubmit(-1)}>
                    <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">Open Chat</Text>
                </Pressable>
            </View>
            );
            console.log("chats:", [chatRoomChat, ...chatsList]);
            return [chatRoomChat, ...chatsList];
        } else {
            return chatsList;
        }
    }       
    return (
        <View className="px-8 text-gray-200 items-center justify-center py-5">
        <Text className="text-pink-400 text-7 mb-7"> All Opened Chats</Text>
        {getChatsList()}
        {/* <Text style={styles.text}> Messages</Text>
        {getMessagesList(placeholder2)} */}
        </View>)
}
const styles = StyleSheet.create({
    container:
    {
      flex: 1,
      backgroundColor: '#F7ACCF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: '#FFF',
        width: '75%',
        backgroundColor: 'white',
        margin: 5,
    },
    helpText: {
        color: '#0994dc',
        fontSize: 50,
        margin: 20,
    },
    text:{
      color: '#0994dc',
      fontSize: 25,
      margin: 10,
    },  
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
