import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import { router } from 'expo-router'
import { BACKEND_URL } from '../config';
import {Chat} from '../../types';
import {useIsFocused} from '@react-navigation/native';
import { useBoundStore } from '@/store/useBound';
import { ImageWithRedirect } from '@/components/ImageWithRedirect';
import axios from 'axios';
export default function Chats(){
    const isFocused = useIsFocused();
    const [chats, setChats] = useState<Chat[]>([]);
    const role = useBoundStore((state) => state.role);
    useEffect(() => {
        const loadChats = async () => {
            const response = await fetch(`${BACKEND_URL}/api/chats`, {
                method: 'GET',
                credentials: 'include',
            });
            const responseData = await response.json();
            // setChats(responseData);
            console.log(responseData);
            setChats(responseData);
            return responseData;
        }
        loadChats();
    }, [isFocused]);
    async function onSubmit(id: Number){
        const selectedChat = chats.filter(chat => chat.chatId === id)[0];
        const chatsResorted = [selectedChat, ...chats.filter(chat => chat.chatId !== id)];
        router.push(`/chats/${id}`);
    }

    function getChatsList(){
        if(chats.length === 0 && role === "Mom"){
            return <Text style={styles.helpText}> You don't have any chats open yet</Text>
        }
        const chatsList = chats.map((chat: any, index: any) => {   
            const date = new Date(chat.lastMessageTime);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            // const redirectURL = fetchRedirectUrl(chat.otherPEWrofileLink);
            console.log("redirectURL: ", chat.redirectURL);
            return (
                <Pressable onPress={()=>onSubmit(chat.id)} key={index} className="items-center justify-start border-2 border-blue-300 rounded-md bg-gray-200 px-3 py-2 mt-4 flex-row">
                    {/* <ImageWithRedirect resizeMode="cover" className="w-6 h-6 rounded-full" source={chat.otherProfileLink}/> */}
                    <Image source={{uri: chat.otherProfileLink}} className="w-8 h-8 rounded-full" resizeMode="cover"/>
                    <View className="ml-5">
                        <Text className="font-primary text-blue-600 text-7">{chat.otherName}</Text>
                        <Text className="font-primary text-gray-500 text-3">{chat.lastMessage}</Text>
                    </View>
                    <Text className="self-start">{month} {day}</Text>
                </Pressable>
            )});
        if(role === "Volunteer" || role === "Admin"){
            const chatRoomChat =         
            (
                <Pressable onPress={()=>onSubmit(-1)} key="chatRoom" className="w-full items-center justify-start border-2 border-blue-300 rounded-md bg-gray-200 px-3 py-3 mt-4 flex-row">
                    <View className="ml-5">
                        <Text className="font-primary text-blue-600 text-7 mb-3">Volunteer Chat Room</Text>
                        {/* <Text className="font-primary text-gray-500 text-3">{chat.lastMessage}</Text> */}
                    </View>
                    {/* <Text className="ml-auto self-start">{month} {day}</Text> */}
                </Pressable>
            );
            return [chatRoomChat, ...chatsList];
        } else {
            return chatsList;
        }
    }       
    return (
        <View className="px-2 text-gray-200 items-center justify-center py-5">
        <Text className="font-primary text-pink-400 text-7 mb-7"> All Chats</Text>
        {getChatsList()}
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
