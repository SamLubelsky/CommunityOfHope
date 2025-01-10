import React, {useEffect, useState, useRef} from 'react';
import { Platform, View, Text, StyleSheet, Pressable } from 'react-native';
import MyButton from '@/components/MyButton';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../app/config';

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
        fetchData();
        const intervalId = setInterval(fetchData, 10000); // 10000 milliseconds = 20 seconds
        return ()=>{
          clearInterval(intervalId)
        };
      },[]);
    async function deactivateHelpRequest(){
      await fetch(`${BACKEND_URL}/api/help_requests/deactivate/`, {
        method: 'POST',
        credentials: 'include',
      })
      setHelping(false);
      setMomName(null);
      setHelpId(null);
    }
    async function unclaimRequest(){
      await fetch(`${BACKEND_URL}/api/help_requests/unclaim/`, {
        method: 'POST',
        credentials: 'include',
      })
      setHelping(false);
      setMomName(null);
      setHelpId(null);
    }
    function HelpCard(){
        return (
            <View className="my-5 items-center justify-center border-2 border-blue-300 rounded-md bg-gray-200 p-2">
                <Text className="font-primary text-yellow-500 my-3 text-6"> You are currently helping {momName}</Text>
                <Pressable className="py-2 px-4 mt-3 bg-blue-200 border self-center rounded-md border-none" onPress={deactivateHelpRequest}>
                  <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">I'm done helping {momName}</Text>
                  <Text className="text-gray-500 text-6 text-center font-primary text-3 m-auto mt-1">{momName} will not be returned to the help list</Text>
                </Pressable>
                <Pressable className="my-5 px-2 py-2 bg-gray-100 border self-center rounded-md border-blue-300 border-2 hover:bg-blue-200" onPress={unclaimRequest}>
                  <Text className="text-blue-600 text-6 text-center font-primary m-auto">Return {momName} to the Help List</Text>
                </Pressable>
            </View>
        );
    }
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
        const requestsList = requests.map((request: any, index: any) => {
            return (
                <View key={index} className="my-5 items-center justify-center border-2 border-blue-300 rounded-md bg-gray-200 p-2">
                    <Text className="font-primary text-yellow-500 text-6 mb-2 mt-2 w-4/5 text-center"> {request.mom_name} needs help with {request.description}</Text>
                    <Pressable className="py-2 px-4 mt-3 bg-blue-200 border self-center rounded-md border-none" onPress={()=>acceptHelpRequest(request.id)}>
                        <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">Accept Help Request</Text>
                    </Pressable>
                </View>
            )});
        return <>
                <Text className="font-primary text-blue-200 text-7 mb-5"> All Current Help Requests</Text>
                {requestsList}
               </>
    }
    function MainContent(){
        if(helping){
            return <HelpCard />
        } else{
            return getRequestsList();
        }
    }
    return (
      <View className="flex-1 bg-gray-100 items-center">
        <MainContent />
      </View>
        )
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
  