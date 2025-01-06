import React, {useEffect, useState, useRef} from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import MyButton from '@/components/MyButton';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../config';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import HelpRequests from '@/components/helpRequests';
import RequestAVolunteer from '@/components/requestAVolunteer';
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
export default function Home(){
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

    const role = useBoundStore((state) => state.role);
    const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

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


    useEffect(() => {
        registerForPushNotificationsAsync()
        .then(token => setExpoPushToken(token ?? ''))
        .catch((error: any) => setExpoPushToken(`${error}`));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
        return ()=>{
            notificationListener.current && 
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current && 
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.text}> Welcome to EPIC!</Text>
            {role === "Mom" ? <RequestAVolunteer /> : <HelpRequests />}
            <MyButton label="Logout" onPress={handleLogout}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container:
    {
      flex: 1,
      backgroundColor: '#F7ACCF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
      color: '#fff',
      fontSize: 50,
      margin: 20,
    },  
  });
  