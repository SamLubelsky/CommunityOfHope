import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../config';
type HelpRequest ={
  name: string;
  category: string;
  id: number;
}
export default function HelpRequests(){
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [refreshCounter, setRefreshCounter] = useState(0);
    const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
      const role = useBoundStore((state) => state.role);
      useEffect(() => {
        if(role == "Mom"){
          router.replace('/requestAVolunteer')
        }
        getRequests();
        const intervalId = setInterval(() => {
          setRefreshCounter(prevCounter => prevCounter + 1);
          console.log("refreshing");
          getRequests();
        }, 60000); // 60000 milliseconds = 1 minute
    
        return () => clearInterval(intervalId); 
      },[]);
    const handleLogout = async () => {
      await fetch(`${BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsSignedIn(false);
    };
    async function submitHelpRequest(id: Number){
        setRequests(requests.filter(request => request.id !== id));
        const response = await fetch(`${BACKEND_URL}/api/help_requests/${id}`, {
          method: 'POST',
          credentials: 'include',
        });
        const responseData = await response.json();

    }
    async function getRequests(){
        const response = await fetch(`${BACKEND_URL}/api/help_requests/active`,{
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
                    <Button label="Accept Help Request" onPress={() => submitHelpRequest(request.id)}/>
                </View>
            )});
    }
    return (<View style={styles.container}>
        <Text style={styles.text}> All Current Help Requests</Text>
        {getRequestsList()}
        <Button label="Logout" onPress={handleLogout} />
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
  