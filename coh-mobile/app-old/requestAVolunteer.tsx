import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';
import { Button, View, Text, StyleSheet, Platform } from 'react-native';
import MyButton from '@/components/MyButton';
import VolunteerRequestForm from "@/components/VolunteerRequestForm";
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../app/config';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants'

type HelpStatus =  "Not Requested" | "Requested" | "Accepted" 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function uploadPushToken(expoPushToken: string) {
  const response = await fetch(`${BACKEND_URL}/api/upload-token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pushToken: expoPushToken }),
  });
  try {
    const data = await response.json();
    if(response.ok){
      console.log(data.message);
    } else{
      console.error(data.error);
    }
  }catch(error){
    console.log("response", response);
    console.error(error);
    console.log("respones ok", response.status);
  }
}
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data; 
      console.log("pushTokenString:", pushTokenString);
      await uploadPushToken(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const RequestAVolunteerScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [helpStatus, setHelpStatus] = useState<HelpStatus>("Not Requested");
  const [volunteerName, setVolunteerName] = useState<string | null>("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
  const role = useBoundStore((state) => state.role);

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
    if(role == "Volunteer"){
      // router.replace('/helpRequests')
      return;
    }
    registerForPushNotificationsAsync()
    .then(token => setExpoPushToken(token ?? ''))
    .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    fetchHelpStatus();
    const intervalId = setInterval(fetchHelpStatus, 15000);
    return ()=>{
      clearInterval(intervalId)
      notificationListener.current && 
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && 
        Notifications.removeNotificationSubscription(responseListener.current);
    };

  }, []);
  const handleLogout = async () => {
    const body = expoPushToken ? { expoPushToken: expoPushToken } : {};
    await fetch(`${BACKEND_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
    setIsSignedIn(false);
  };
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
    </View>
      <MyButton label="Logout" onPress={handleLogout} />
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