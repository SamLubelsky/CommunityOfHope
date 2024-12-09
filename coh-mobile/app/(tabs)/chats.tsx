import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '@/components/Button';
import { router } from 'expo-router'
const placeholder1 = {chats: [{name: "Sharon", chatId: 3},{name: "Jennifer", chatId: 4},{name: "Alice", chatId: 5},]}
import {Chat} from '../../types';
export default function Chats(){
    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(() => {
        const loadChats = async () => {
            const response = await fetch('http://localhost:3000/api/chats', {
                method: 'GET',
                credentials: 'include',
            });
            const responseData = await response.json();
            setChats(responseData);
            console.log(responseData);
            return responseData;
        }
        loadChats();
    }, []);
    async function onSubmit(id: Number){
        router.push(`/chats/${id}`);
    }

    function getChatsList(){
        if(chats.length == 0){
            return <Text style={styles.helpText}> You don't have any chats open yet</Text>
        }
        return chats.map((chat: any, index: any) => {
            return (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.text}> {chat.otherName}</Text>
                    <Button label="Open Chat" onPress={() => onSubmit(chat.chatId)}/>
                </View>
            )});
    }       
    return (
        <View style={styles.container}>
        <Text style={styles.text}> All Current Chats</Text>
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
