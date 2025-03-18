import React, {useEffect, useState, useRef} from 'react';
import { Platform, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../app/config';
import {ButtonWithConfirmation} from '@/components/ButtonWithConfirmation';
import {PrimaryButton} from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ErrorContext } from '@/components/ErrorBoundary';
import {handleError} from '@/utils/error';
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
    const [chatId, setChatId] = useState<number | null>(null);
    const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
    const throwError = React.useContext(ErrorContext);

      const role = useBoundStore((state) => state.role);
      useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 10000); // 10000 milliseconds = 20 seconds
        return ()=>{
          clearInterval(intervalId)
        };
      },[]);
    async function deactivateHelpRequest(){
      const response = await fetch(`${BACKEND_URL}/api/help_requests/deactivate/`, {
        method: 'POST',
        credentials: 'include',
      })
      if(!response.ok){
        const data = await response.json();
        handleError(throwError, data);
      }
      setHelping(false);
      setMomName(null);
      setHelpId(null);
    }
    async function unclaimRequest(){
      const response = await fetch(`${BACKEND_URL}/api/help_requests/unclaim/`, {
        method: 'POST',
        credentials: 'include',
      })
      if(!response.ok){
        const data = await response.json();
        handleError(throwError, data);
      }
      setHelping(false);
      setMomName(null);
      setHelpId(null);
    }
    function HelpCard(){
        return (
            <View className="my-5 items-center justify-center border-2 border-blue-300 rounded-md bg-gray-200 px-2 py-4">
                <Text className="font-primary text-yellow-500 mb-4 text-6"> You are currently helping {momName}</Text>
                <PrimaryButton text="Open Chat" onPress={()=>router.push(`/chats/${chatId}`)} />
                <ButtonWithConfirmation className="mb-3 px-2 py-2 bg-gray-100 border self-center rounded-md border-green-500 border-2 hover:bg-blue-200 bg-gray-200"
                  danger={false}
                  onConfirm={deactivateHelpRequest}
                  confirmText={`Are you sure you're done helping ${momName}?`}>
                  <Text className="text-green-500 text-5 text-center font-primary text-5 m-auto font-7">I'm done helping</Text>
                </ButtonWithConfirmation>
                <ButtonWithConfirmation className="mb-3 px-2 py-2 bg-gray-100 border self-center rounded-md border-red-500 border-2 hover:bg-blue-200 bg-gray-200"
                  onConfirm={unclaimRequest}
                  danger={true}
                  confirmText={`Are you sure you would like to return ${momName} to the Help List?`}>
                  <Text className="text-red-600 text-5 text-center font-primary text-5 m-auto font-7">Return to the help list</Text>
                </ButtonWithConfirmation>
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
      } else{
        const data = await response.json();
        handleError(throwError, data);
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
        if(!response.ok){
          handleError(throwError, data);
        }
        if(data.status === 'Accepted'){
          setHelping(true);
          setMomName(data.momName);
          setHelpId(data.helpId);
          setChatId(data.chatId);
        }
    }
    async function getRequests(){
        const response = await fetch(`${BACKEND_URL}/api/help_requests/unclaimed`,{
          method: 'GET',
          credentials: 'include',
        });
        const json = await response.json();
        if(!response.ok){
          handleError(throwError, json);
        }
        setRequests(json.Requests);
    }
    function getRequestsList(){
        if (!requests){
            return <Text className="text-yellow-7 font-primary">No requests found</Text>;
        }
        const requestsList = requests.map((request: any, index: any) => {
          const {emergency} = request;
          console.log(emergency);
            return (
                <View key={index} className={`${emergency ? "border-red-500 bg-red-100" : "border-blue-300 bg-gray-200"} my-5 items-center justify-center border-2 rounded-lg p-4`}>
                    <Text className="font-primary text-yellow-500 text-6 mb-2 w-12 text-center"> {request.mom_name} needs help with {request.description}</Text>
                    <ButtonWithConfirmation className="py-2 px-4 mt-3 bg-blue-200 border self-center rounded-md border-none"
                      danger={false}
                      onConfirm={()=>acceptHelpRequest(request.id)}
                      confirmText={`Are you sure you would like to accept this help request?`}>
                      <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">Accept Help Request</Text>
                    </ButtonWithConfirmation>
                </View>
            )});
        return <>
                <Text className="font-primary text-center text-blue-200 text-7 mb-5"> All Current Help Requests</Text>
                  <ScrollView showsVerticalScrollIndicator={false}>
                {requestsList}
                </ScrollView>
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