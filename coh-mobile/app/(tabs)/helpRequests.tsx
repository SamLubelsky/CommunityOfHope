import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';
const placeholder = {"Requests": [{"Name": "Sharon", "Category": "Hospital Stay", "requestId": 2},
 {"Name": "Jennifer", "Category": "Grocery Shopping", "requestId": 3,},
 {"Name": "Alice", "Category": "Help At Home", "requestId": 1},]}
type HelpRequest ={
  name: string;
  category: string;
  id: number;
}
export default function HelpRequests(){
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    async function onSubmit(id: Number){
        setRequests(requests.filter(request => request.id !== id));
        // const response = await fetch('/api/acceptRequest', {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({id}),
        // });
        // const json = await response.json();
        console.log(`Request ${id} accepted`);

    }
    async function getRequests(){
        const response = await fetch('http://localhost:3000/api/help_requests',{
          method: 'GET',
          credentials: 'include',
        });
        const json = await response.json();
        setRequests(json.Requests);
    }
    function getRequestsList(){
        if (!requests){
            return <Text style={styles.helpText}>No requests found</Text>;
        }
        return requests.map((request: any, index: any) => {
            return (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.helpText}> {request.mom_name} needs help with: {request.category}</Text>
                    <Text style={styles.descriptionText}>{request.description}</Text>
                    <Button label="Accept Help Request" onPress={() => onSubmit(request.id)}/>
                </View>
            )});
    }
    useEffect(() => {
          getRequests();
        }, []);
    return (<View style={styles.container}>
        <Text style={styles.text}> All Current Help Requests</Text>
        {getRequestsList()}
        </View>)
}
const styles = StyleSheet.create({
    descriptionText:{
      color: 'white',
      fontSize: 16,
      margin: 5, 
    },
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
  