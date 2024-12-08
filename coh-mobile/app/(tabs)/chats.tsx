import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '@/components/Button';
import { router } from 'expo-router'
const placeholder1 = {chats: [{name: "Sharon", chatId: 3},{name: "Jennifer", chatId: 4},{name: "Alice", chatId: 5},]}
export default function Chats(){
    async function onSubmit(id: Number){
        router.push(`/chats/${id}`);
        // const response = await fetch('/api/sendMessage', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({id}),
        // });
        // const json = await response.json();
        // console.log(`Message ${id} sent`);
    }
    function getChatsList(data: any){
        return data.chats.map((chat: any, index: any) => {
            return (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.helpText}> Chat with {chat.name}</Text>
                    <Button label="Open Chat" onPress={() => onSubmit(chat.chatId)}/>
                </View>
            )});
    }       
    function getMessagesList(data: any){
        return data.messages.map((message: any, index: any) => {
            return (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.helpText}> {message.user}: {message.message}</Text>
                </View>
            )});
    }
    return (
        <View style={styles.container}>
        <Text style={styles.text}> All Current Chats</Text>
        {getChatsList(placeholder1)}
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
        width: '90%',
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
  });
