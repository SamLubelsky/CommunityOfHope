import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MyButton from '@/components/MyButton';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../config';
type HelpRequest ={
  mom_name: string;
  category: string;
  id: number;
}
export default function HelpRequests(){
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const[helping, setHelping] = useState<boolean>(false);
    const [momName, setMomName] = useState<string | null>(null);
    const [helpId, setHelpId] = useState<number | null>(null);
    const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
      const role = useBoundStore((state) => state.role);
      useEffect(() => {
        if(role == "Mom"){
          router.replace('/requestAVolunteer')
        }
        fetchData();
        const intervalId = setInterval(() => {
          fetchData();
        }, 10000); // 10000 milliseconds = 20 seconds
        return ()=> clearInterval(intervalId);
      },[]);
    async function deactivateHelpRequest(){
      setHelping(false);
      setMomName(null);
      setHelpId(null);
      await fetch(`${BACKEND_URL}/api/help_requests/deactivate/`, {
        method: 'POST',
        credentials: 'include',
      })
    }
    function HelpCard(){
        return (
            <View style={styles.helpCard}>
                <Text style={styles.helpText}> You are currently helping {momName}</Text>
                <MyButton label={`Finish Helping ${momName}`} onPress={deactivateHelpRequest}/>
            </View>
        );
    }
    const handleLogout = async () => {
      await fetch(`${BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsSignedIn(false);
    };
    async function acceptHelpRequest(id: Number){
      const submittedHelpRequest = requests.filter(request => request.id === id)[0];
      setRequests(requests.filter(request => request.id !== id));
      const response = await fetch(`${BACKEND_URL}/api/help_requests/${id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if(response.ok){
        setHelping(true);
        setMomName(submittedHelpRequest.mom_name);
        setHelpId(submittedHelpRequest.id);
        setRequests(requests.filter(request => request.id !== id));
      }
    }
    async function fetchData(){
        await getRequests();
        await getHelpStatus();

    }
    async function getHelpStatus(){
        const response = await fetch(`${BACKEND_URL}/api/help_status`,{
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if(data.status === 'Accepted'){
          setHelping(true);
          setMomName(data.momName);
          setHelpId(data.helpId);
        }
    }
    async function getRequests(){
        const response = await fetch(`${BACKEND_URL}/api/help_requests/unclaimed`,{
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
                    <Text style={styles.helpText}> {request.mom_name} needs help with {request.description}</Text>
                    <MyButton label="Accept Help Request" onPress={() => acceptHelpRequest(request.id)}/>
                </View>
            )});
    }
    function MainContent(){
        if(helping){
            return <HelpCard />
        } else{
            return getRequestsList();
        }
    }
    return (<View style={styles.container}>
        <Text style={styles.text}> All Current Help Requests</Text>
        <MainContent />
        <MyButton label="Logout" onPress={handleLogout} />
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
    helpCard:{
      backgroundColor: '#ff4d4d',
      padding: 20,
      margin: 20,
      borderRadius: 20,
    },
    helpText: {
      color: 'white',
      fontSize: 24,
      margin: 5,
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
  