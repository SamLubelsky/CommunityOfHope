import React, {useEffect, useState} from 'react';
import { useLocalSearchParams } from 'expo-router';
import {View, Text, StyleSheet} from 'react-native';
const placeholder2 = {messages: [{user: "Them", message: "Hi, I need help with my groceries", messageId: 2},
    {user: "You", message: "Ok, if you could come over in the next hour that would be great", messageId: 3,},
    ]}
type Message = {
    user: string;
    message: string;
    messageId: number;
}
export default function Page(){
    const chatId = Number(useLocalSearchParams().slug);
    const [messages, setMessages] = useState<Message[]>([]);
    function getMessages(chatId: Number){
        return placeholder2.messages;
    }
    function displayMessages(messages: any){
        return messages.map((message: any, index: any) => {
            if(message.user === "You"){
                return (
                    <View key={index} style={styles.itemContainerYou}>
                        <Text style={styles.helpText}> {message.user}: {message.message}</Text>
                    </View>
                ); 
            }
            else{
                return (
                    <View key={index} style={styles.itemContainerThem}>
                        <Text style={styles.helpText}> {message.user}: {message.message}</Text>
                    </View>
                );
            }});
    }
    useEffect(() => {
        const messages = getMessages(chatId);
        setMessages(messages);
    }, []);
    return (
        <View style={styles.container}>
        ChatId: {chatId}
        {displayMessages(messages)}
        </View>
    );
}
const styles = StyleSheet.create({
    container:
    {
      flex: 1,
      backgroundColor: '#F7ACCF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContainerYou: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: '#FFF',
        alignSelf: 'flex-end',
        width: '60%',
        margin: 5,
    },
    itemContainerThem: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        alignSelf: 'flex-start',
        borderColor: '#FFF',
        width: '60%',
        margin: 5,
    },
    text:{
      color: '#fff',
      fontSize: 50,
      margin: 20,
    },  
    helpText:{
        color: 'white',
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
  