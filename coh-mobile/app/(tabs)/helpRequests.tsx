import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';
const placeholder = {"Requests": [{"Name": "Sharon", "Category": "Hospital Stay", "requestId": 2},
 {"Name": "Jennifer", "Category": "Grocery Shopping", "requestId": 3,},
 {"Name": "Alice", "Category": "Help At Home", "requestId": 1},]}

export default function HelpRequests(){
    async function onSubmit(id: Number){
        const response = await fetch('/api/acceptRequest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id}),
        });
        const json = await response.json();
        console.log(`Request ${id} accepted`);
    }
    function getRequestsList(data: any){
        return data.Requests.map((request: any, index: any) => {
            return (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.helpText}> {request.Name} needs help with: {request.Category}</Text>
                    <Button theme="primary" label="Accept Help Request" onPress={() => onSubmit(request.requestId)}/>
                </View>
            )});
    }
    return (<View style={styles.container}>
        <Text style={styles.text}> All Current Help Requests</Text>
        {getRequestsList(placeholder)}
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
  