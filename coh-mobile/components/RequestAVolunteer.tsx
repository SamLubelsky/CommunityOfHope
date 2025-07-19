import * as React from 'react';
import { useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import VolunteerRequestForm from "@/components/VolunteerRequestForm";
import { BACKEND_URL } from '../app/config';
import "../global.css";
import { router } from 'expo-router';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { ButtonWithConfirmation } from './ButtonWithConfirmation';
type HelpStatus =  "Not Requested" | "Requested" | "Accepted" 

const RequestAVolunteer = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [helpStatus, setHelpStatus] = useState<HelpStatus>("Not Requested");
  const [volunteerName, setVolunteerName] = useState<string | null>("");
  const [description, setDescription] = useState<string | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const requestVolunteer = () => {
    setIsModalVisible(true);
  };  
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  async function fetchHelpStatus(){
    const response = await fetch(`${BACKEND_URL}/api/help_status`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if(!response.ok){
      console.error(data);
    }
    setHelpStatus(data.status);
    setDescription(data.description);
    setChatId(data.chatId);
    if (data.status === "Accepted") {
      setVolunteerName(data.volunteerName);
    }
  }

  useEffect(() => {
    fetchHelpStatus();
    const intervalId = setInterval(fetchHelpStatus, 15000);
    return ()=>{
      clearInterval(intervalId);
    };

  }, []);
  const deactiveRequest= async () => {
    setHelpStatus("Not Requested")
    setVolunteerName(null);
    setDescription(null);
    setChatId(null);
    const response = await fetch(`${BACKEND_URL}/api/help_requests/deactivate/`, {
      method: 'POST',
      credentials: 'include',
    });
    if(!response.ok){
      const data = await response.json();
      console.error(data);
    }
  }
  function HelpCard(){
    // console.log("helpStatus:", helpStatus)
    if(helpStatus === "Not Requested"){
      return <></>;
    }
    if(helpStatus === "Requested"){
      return (
        <View className="py-3 my-3 px-3 mx-3 rounded-md border-blue-300 border-2 bg-gray-200">
          <Text className="mb-4 font-primary text-gray-500 text-8 text-center">You have requested help for {description}</Text>
          <Text className="mb-4 font-primary text-yellow-500 text-7 text-center">Please wait for a volunteer to accept</Text>
          <ButtonWithConfirmation className="bg-gray-300 w-12 h-7 bg-gray-100 border self-center rounded-md border-blue-500 border-2" 
          onConfirm={deactiveRequest} 
          confirmText={`Are you sure you would like to cancel your help request?`}
          danger={true}>
            <Text className="text-blue-600 text-6 text-center font-primary m-auto">Cancel Help Request</Text>
          </ButtonWithConfirmation>
        </View>
      );
    }
    if(helpStatus === "Accepted"){
      return (
        <View className="py-3 px-5 rounded-md border-blue-300 border-2 bg-gray-200">
          <Text className="w-12 font-primary text-center text-blue-600 text-7 mb-4 mx-2">Your help request has been accepted by {volunteerName}</Text>
          <PrimaryButton text="Open Chat" onPress={()=>router.push(`/chats/${chatId}`)} />
          <ButtonWithConfirmation 
          className="bg-gray-200 px-4 py-2 bg-gray-100 border self-center rounded-md border-blue-300 border-2 hover:bg-blue-200"
          onConfirm={deactiveRequest}
          danger={true}
          confirmText={`Are you sure you are done being helped?(this action cannot be undone)`}>
            <Text className="text-blue-600 text-6 text-center font-primary m-auto">I'm done being helped</Text>
          </ButtonWithConfirmation>
        </View>
      );
    } 
  }
  return (
    <View className="flex-1">
      {helpStatus === "Not Requested" ?
          <PrimaryButton text="Request a volunteer" onPress={requestVolunteer} />
          : <HelpCard />
      }      
      <VolunteerRequestForm setHelpStatus={setHelpStatus} setDescription={setDescription} isVisible={isModalVisible} onClose={onModalClose} />

    </View>
  );
};

export default RequestAVolunteer;