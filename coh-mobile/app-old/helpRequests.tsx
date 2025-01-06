import React, {useEffect, useState, useRef} from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import MyButton from '@/components/MyButton';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../app/config';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants'

type HelpRequest ={
  mom_name: string;
  category: string;
  id: number;
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
  throw new Error(errorMessage);
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
export default function HelpRequests(){
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const[helping, setHelping] = useState<boolean>(false);
    const [momName, setMomName] = useState<string | null>(null);
    const [helpId, setHelpId] = useState<number | null>(null);
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    
    const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();


      const role = useBoundStore((state) => state.role);
      useEffect(() => {
        if(role == "Mom"){
          // router.replace('/requestAVolunteer')
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
        fetchData();
        const intervalId = setInterval(fetchData, 10000); // 10000 milliseconds = 20 seconds
        return ()=>{
          clearInterval(intervalId)
          notificationListener.current && 
            Notifications.removeNotificationSubscription(notificationListener.current);
          responseListener.current && 
            Notifications.removeNotificationSubscription(responseListener.current);
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
            <View style={styles.helpCard}>
                <Text style={styles.helpText}> You are currently helping {momName}</Text>
                <MyButton label={`Finish Helping ${momName}`} onPress={deactivateHelpRequest}/>
                <MyButton label={`Return ${momName} to the Help List`} onPress={unclaimRequest}></MyButton>
            </View>
        );
    }
    const handleLogout = async () => {
      const body = expoPushToken ? { expoPushToken: expoPushToken } : {};
      await fetch(`${BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
      });
      console.log(body);
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
          <Text>Your Expo push token: {expoPushToken}</Text>
        </View>
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
  