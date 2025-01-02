import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import VolunteerRequestForm from "@/components/VolunteerRequestForm";
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../config';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

type HelpStatus =  "Not Requested" | "Requested" | "Accepted" 

const RequestAVolunteerScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [helpStatus, setHelpStatus] = useState<HelpStatus>("Not Requested");
  const [volunteerName, setVolunteerName] = useState<string | null>("");
  const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
  const role = useBoundStore((state) => state.role);

  const requestVolunteer = () => {
    setIsModalVisible(true);
  };  
  const onModalClose = () => {
    setIsModalVisible(false);
  };


  useEffect(() => {
    if(role == "Volunteer"){
      router.replace('/helpRequests')
    } else{
    // const registerForPushNotificationsAsync = async () => {
    //   const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    //   if (status !== 'granted') {
    //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //     if (status !== 'granted') {
    //       alert('Failed to get push token for push notification!');
    //       return;
    //     }
    //   }
    //   const token = (await Notifications.getExpoPushTokenAsync()).data;
    //   console.log(token);
    //   // Send the token to your backend server from where you can send push notifications
    // };

    // registerForPushNotificationsAsync();

    // const checkForAcceptedRequests = async () => {
    //   const response = await fetch(`${BACKEND_URL}/api/checkAcceptedRequests`, {
    //     method: "GET",
    //     credentials: "include",
    //   });
    //   const data = await response.json();
    //   if (data.accepted) {
    //     await Notifications.scheduleNotificationAsync({
    //       content: {
    //         title: "Help Request Accepted",
    //         body: "Your help request has been accepted!",
    //       },
    //       trigger: null,
    //     });
    //   }
    // };

    // const intervalId = setInterval(checkForAcceptedRequests, 5000);

    // return () => clearInterval(intervalId);
    const fetchHelpStatus = async () => {
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
    fetchHelpStatus();
    const intervalId = setInterval(fetchHelpStatus, 15000);
    return ()=>clearInterval(intervalId);
    } 
  }, []);
  const handleLogout = async () => {
    await fetch(`${BACKEND_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsSignedIn(false);
  };
  function HelpCard(){
    console.log("helpStatus:", helpStatus)
    if(helpStatus === "Not Requested"){
      return <></>;
    }
    if(helpStatus === "Requested"){
      return (
        <View style={styles.helpCard}>
          <Text style={styles.helpText}>Your help request has been sent</Text>
          <Text style={styles.helpText2}>Please wait for a volunteer to accept</Text>  
        </View>
      );
    }
    if(helpStatus === "Accepted"){
      return (
        <View style={styles.helpCard}>
          <Text style={styles.helpText}>Your help request has been accepted by {volunteerName}</Text>
        </View>
      );
    } 
  }
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}> Welcome to EPIC!</Text>
      </View>
      <Button label="REQUEST A VOLUNTEER" onPress={requestVolunteer} />
      <VolunteerRequestForm setHelpStatus={setHelpStatus} isVisible={isModalVisible} onClose={onModalClose} />
      <HelpCard />
      <Button label="Logout" onPress={handleLogout} />
    </View>
  );
};

export default RequestAVolunteerScreen;

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