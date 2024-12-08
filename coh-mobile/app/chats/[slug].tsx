import React, {useEffect, useState} from 'react';
import { useLocalSearchParams } from 'expo-router';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import Button from '@/components/Button';
import {io} from 'socket.io-client';
const placeholder2 = {messages: [{user: "Them", message: "Hi, I need help with my groceries", messageId: 2},
    {user: "You", message: "Ok, if you could come over in the next hour that would be great", messageId: 3,},
    ]}
type Message = {
    user: string;
    message: string;
    messageId: number;
}
export default function Page(){
    const socket = io('ws://localhost:3000');
    console.log(socket);
    const chatId = Number(useLocalSearchParams().slug);
    const [messages, setMessages] = useState<Message[]>([]);
    const[curMessage, setCurMessage] = useState<string>('');
    useEffect(() => {
        const loadMessages = async () => {
            fetch("http://localhost:3000/api/messages", {
            }
            )
        }
        loadMessages();
    }, []);
    socket.on("chat message", (data)=>{
        console.log(`Received message: ${data}`);
    })
    socket.on('connect', () => {
        console.log('connected');
    });     

    function sendMessage(){
        if(curMessage === ''){
            return;
        }
        socket.emit('chat message', curMessage);
        console.log(`Sent message: ${curMessage}`);
        setCurMessage('');
    }
    function displayMessages(messages: any){
        return messages.map((message: any, index: any) => {
            if(message.user === "You"){
                return (
                    <View key={index} style={[styles.messageContainer, styles.you]}>
                        <Text style={styles.messageText}> {message.user}: {message.message}</Text>
                    </View>
                ); 
            }
            else{
                return (
                    <View key={index} style={[styles.messageContainer, styles.them]}>
                        <Text style={styles.messageText}> {message.user}: {message.message}</Text>
                    </View>
                );
            }});
    }
    return (
        <View style={styles.container}>
        <Text>ChatId: {chatId}</Text>
        {displayMessages(messages)}
        <View key={-1} style={styles.messageContainer}>
            <TextInput editable multiline onChangeText={msg=>setCurMessage(msg)} style={styles.inputText} value={curMessage}> You: </TextInput>
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
        color: 'white',
        fontSize: 24,
        width:"100%",
        padding: 5,
    },
    messageText:{
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
  