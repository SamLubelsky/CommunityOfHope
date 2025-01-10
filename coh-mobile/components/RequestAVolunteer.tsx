import * as React from 'react';
import { useContext, useEffect, useState} from 'react';
import { View, Text, StyleSheet, Platform, Pressable, Button } from 'react-native';
import MyButton from '@/components/MyButton';
import VolunteerRequestForm from "@/components/VolunteerRequestForm";
import { BACKEND_URL } from '../app/config';
import "../global.css";
type HelpStatus =  "Not Requested" | "Requested" | "Accepted" 

const RequestAVolunteer = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [helpStatus, setHelpStatus] = useState<HelpStatus>("Not Requested");
  const [volunteerName, setVolunteerName] = useState<string | null>("");
  const [description, setDescription] = useState<string | null>(null);
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
    setHelpStatus(data.status);
    setDescription(data.description);
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
    await fetch(`${BACKEND_URL}/api/help_requests/deactivate/`, {
      method: 'POST',
      credentials: 'include',
    })
  }
  function HelpCard(){
    // console.log("helpStatus:", helpStatus)
    if(helpStatus === "Not Requested"){
      return <></>;
    }
    if(helpStatus === "Requested"){
      return (
        <View className="flex-1 py-3 my-3 px-5 rounded-md border-blue-300 border-2 bg-gray-200">
          <Text className="my-4 font-primary text-blue-600 text-8 text-center">You have requested help for {description}</Text>
          <Text className="my-4 font-primary text-yellow-500 text-7 text-center">Please wait for a volunteer to accept</Text>  
          <Pressable className="my-5 w-12 h-7 bg-gray-100 border self-center rounded-md border-blue-300 border-2" onPress={deactiveRequest}>
            <Text className="text-blue-600 text-6 text-center font-primary m-auto">Cancel Help Request</Text>
          </Pressable>
        </View>
      );
    }
    if(helpStatus === "Accepted"){
      return (
        <View className="w-14 flex-1 py-5 my-3 px-5 rounded-md border-blue-300 border-2 bg-gray-200">
          <Text className="font-primary text-center text-blue-600 text-7 my-4 mx-6">Your help request has been accepted by {volunteerName}</Text>
          <Pressable className="my-5 w-13 h-7 bg-gray-100 border self-center rounded-md border-blue-300 border-2 hover:bg-blue-200" onPress={deactiveRequest}>
            <Text className="text-blue-600 text-6 text-center font-primary m-auto">I'm done being helped by {volunteerName}</Text>
          </Pressable>
        </View>
      );
    } 
  }
  return (
    <View>
      {helpStatus === "Not Requested" ?
          <Pressable className="w-12 h-7 bg-blue-200 border self-center rounded-md border-none" onPress={requestVolunteer}>
            <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">Request a volunteer</Text>
          </Pressable>
          : <HelpCard />
      }      
      <VolunteerRequestForm setHelpStatus={setHelpStatus} setDescription={setDescription} isVisible={isModalVisible} onClose={onModalClose} />

    </View>
  );
};

export default RequestAVolunteer;

const styles = StyleSheet.create({
});