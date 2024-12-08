import React, {useEffect, useState} from 'react';
import { useLocalSearchParams } from 'expo-router';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import Button from '@/components/Button';
// import { socket } from "../socket";
import { useBoundStore } from '@/store/useBound';
import { io } from 'socket.io-client';

type Message = {
    senderId: number;
    message: string;
}
export default function Page(){
    const chatId = Number(useLocalSearchParams().slug);
    const id = useBoundStore((state) => state.id);
    const [messages, setMessages] = useState<Message[]>([]);
    const[curMessage, setCurMessage] = useState<string>('');
    const [socket, setSocket] = useState<ReturnType<typeof io>>();
    useEffect(() => {
        const loadMessages = async () => {
            const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
                method: 'GET',
                credentials: 'include',
            })
            const responseData = await response.json();
            setMessages(responseData);
        }
        loadMessages();
        const socket = io('http://localhost:3000');
        setSocket(socket);
        socket.on("message", (data)=>{
            setMessages((prevMessages) => [...prevMessages, data])
        })
        socket.on('askId', () =>{
            socket.emit('idResponse', String(id));
            console.log(`Sent id: ${id} to server`);
        })
        socket.on('messageReceived', msg=>{
            console.log("message successfully received by server");
        })
        socket.emit('idReady');
    }, []);
    function sendMessage(){
        if(curMessage === ''){
            return;
        }
        const data = {message: curMessage, senderId: id, chatId};
        if(socket){
            socket.emit('message', data);
        }
        console.log(`Sent message:`, data);
        setMessages([...messages, data]);
        console.log(messages);
        setCurMessage('');
    }
    function displayMessages(messages: any){
        if(messages.length == 0){
            return;
        }
        return messages.map((message: any, index: any) => {
            if(message.senderId === id){
                return (
                    <View key={index} style={[styles.messageContainer, styles.you]}>
                        <Text style={styles.messageText}> {message.message}</Text>
                    </View>
                ); 
            }
            else{
                return (
                    <View key={index} style={[styles.messageContainer, styles.them]}>
                        <Text style={styles.messageText}> {message.message}</Text>
                    </View>
                );
            }});
    }
    return (
        <View style={styles.container}>
        <Text>ChatId: {chatId}</Text>
        {displayMessages(messages)}
        <View key={-1} style={styles.messageContainer}>
            <TextInput editable multiline onChangeText={msg=>setCurMessage(msg)} style={styles.inputText} value={curMessage}></TextInput>
        </View>
        <Button label="Send Message" onPress={()=>sendMessage()}></Button>
        </View>
    );
}
const styles = StyleSheet.create({
    button: {
        width:"100%",
    },
    container:
    {
      flex: 1,
      backgroundColor: '#F7ACCF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messageContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'left',
        borderWidth: 5,
        borderColor: '#FFF',
        alignSelf: 'flex-end',
        width: '60%',
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 20,
    },
    you: {
        alignSelf: 'flex-end',
    },
    them: {
        alignSelf: 'flex-start',
    },
    text:{
      color: '#fff',
      fontSize: 50,
      margin: 20,
    },  
    inputText:{
        color: 'black',
        fontSize: 24,
        width:"100%",
        padding: 5,
    },
    messageText:{
        alignSelf: 'flex-start',
        padding: 10,
        color: 'black',
        fontSize: 24, 
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  });
  