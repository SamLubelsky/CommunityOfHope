import React, {useEffect, useState} from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {ScrollView, View, Text, TextInput, StyleSheet, Image, SafeAreaView} from 'react-native';
import { AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { socket } from "../socket";
import { useBoundStore } from '@/store/useBound';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../config';
import { Chat, Message } from '@/types';



export default function Page(){

    const chatId = Number(useLocalSearchParams().slug);

    const id = useBoundStore((state) => state.id);

    const [messages, setMessages] = useState<Message[]>([]);
    const[curMessage, setCurMessage] = useState<string>('');
    const [socket, setSocket] = useState<ReturnType<typeof io>>();
    const [height, setHeight] = useState<number>(25);
    const [appState, setAppState] = useState(AppState.currentState);
    const [otherName, setOtherName] = useState<string>('');
    const [otherProfileLink, setOtherProfileLink] = useState<string>('');

    const scrollViewRef = React.useRef<ScrollView | null>(null);

    useEffect(() => {
        const loadMessages = async () => {
            const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}`, {
                method: 'GET',
                credentials: 'include',
            })
            const responseData = await response.json();
            if(!responseData.error){
                setMessages(responseData.messages);
                setOtherName(responseData.otherName);
                setOtherProfileLink(responseData.otherProfileLink);
            }
        }
        loadMessages();
        const socket = io(BACKEND_URL, {withCredentials: true});
        // const socket = io(BACKEND_URL);
        setSocket(socket);
        socket.on("message", (data)=>{  
            setMessages((prevMessages) => [...prevMessages, data])
        });
        socket.on('messageReceived', msg=>{
            // console.log("message successfully received by server");
        })
        //RELOAD MESSAGES 
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
              // App has come to the foreground
              console.log('App has been reopened');
              loadMessages();
            }
      
            setAppState(nextAppState);
          });
      
          return () => {
            subscription.remove();
          };
    }, []);
    function sendMessage(){
        if(curMessage === ''){
            return;
        }
        const data = {message: curMessage, senderId: id, chatId};
        if(socket){
            socket.emit('message', data);
        }
        setMessages([...messages, data]);
        setCurMessage('');
    }
    function displayMessages(){
        console.log("otherProfileLink: ", otherProfileLink);
        if(messages.length == 0){
            return;
        }
        return messages.map((message: any, index: any) => {
            if(message.senderId === id){
                return (
                    <View key={index} className="mx-4 self-end items-start justify-center border-2 border-blue-300 w-4/5 p-2 m-1 bg-blue-100 rounded-2xl">
                        <Text className="font-primary text-blue-800 text-4"> {message.message}</Text>
                    </View>
                ); 
            }
            else{
                return (
                    <View key={index} className="mx-4 self-start items-start justify-center border-2 border-pink-300 w-3/4 p-2 m-1 bg-pink-100 rounded-2xl">
                        <Text className="font-primary text-pink-800 text-4"> {message.message}</Text>
                    </View>
                );
            }});
    }
    return ( 
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="w-full flex-row items-center justify-start py-2 px-2 bg-gray-300 mb-5">
                <Ionicons className="mr-4" name="arrow-back" size={24} color="black" onPress={()=>{router.back()}}/>
                <Image resizeMode="contain" className="w-7 h-7 rounded-full mr-4" source={{uri: otherProfileLink}} />
                <Text className="font-primary text-7 text-pink-500">{otherName}</Text>
            </View>
            <ScrollView 
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
            {displayMessages()}
            <View className="mx-6 flex-row justify-start items-center">
                <View key={-1} className="flex-1 self-end items-start justify-center border-2 border-blue-300 p-2 m-1 bg-blue-100 rounded-2xl">
                    <TextInput style={{height: Math.min(height, 200)}}  
                        editable 
                        multiline 
                        onChangeText={msg=>setCurMessage(msg)}  
                        onContentSizeChange={(event) => {
                            setHeight(event.nativeEvent.contentSize.height);
                        }}
                        value={curMessage}
                        placeholder="Text message"
                        className="font-primary text-blue-800 text-4 w-full p-1"
                    />
                </View>
                <Ionicons name="send-outline" size={26} color="black" onPress={sendMessage}/>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}