import * as React from 'react';
import { useContext, useEffect, useState} from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MyButton from '@/components/MyButton';
import VolunteerRequestForm from "@/components/VolunteerRequestForm";
import { BACKEND_URL } from '../app/config';
type HelpStatus =  "Not Requested" | "Requested" | "Accepted" 

const RequestAVolunteer = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [helpStatus, setHelpStatus] = useState<HelpStatus>("Not Requested");
  const [volunteerName, setVolunteerName] = useState<string | null>("");

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
        <View style={styles.helpCard}>
          <Text style={styles.helpText}>Your help request has been sent</Text>
          <Text style={styles.helpText2}>Please wait for a volunteer to accept</Text>  
          <MyButton label="Cancel your help request" onPress={deactiveRequest}/>
        </View>
      );
    }
    if(helpStatus === "Accepted"){
      return (
        <View style={styles.helpCard}>
          <Text style={styles.helpText}>Your help request has been accepted by {volunteerName}</Text>
          <MyButton label={`Im done being helped by ${volunteerName}`} onPress={deactiveRequest}/>
        </View>
      );
    } 
  }
  return (
    <View style={styles.container}>
      <MyButton label="REQUEST A VOLUNTEER" onPress={requestVolunteer} />
      <VolunteerRequestForm setHelpStatus={setHelpStatus} isVisible={isModalVisible} onClose={onModalClose} />
      <HelpCard />
    </View>
  );
};

export default RequestAVolunteer;

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7ACCF',
    alignItems: 'center',
    justifyContent: 'center',
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
  helpText2: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
  textContainer: {
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
  },
});