import React, {useEffect, useState, useRef, useContext} from 'react';
import { Platform, View, Text, StyleSheet, Pressable } from 'react-native';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from '../config';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {useIsFocused} from '@react-navigation/native';
import Constants from 'expo-constants';
import HelpRequests from '@/components/HelpRequests';
import RequestAVolunteer from '@/components/RequestAVolunteer';
import { ErrorContext } from '@/components/ErrorBoundary';
import {handleError} from '@/utils/error';
import "../../global.css";

export default function Home(){
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

    const isFocused = useIsFocused();

    const role = useBoundStore((state) => state.role);
    const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();
    const throwError = useContext(ErrorContext);

    function handleRegistrationError(errorMessage: string) {
      handleError(throwError, {message: errorMessage});
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
            await uploadPushToken(pushTokenString);
            return pushTokenString;
            } catch (e: unknown) {
            handleRegistrationError(`${e}`);
            }
        } else {
            handleRegistrationError('Must use physical device for push notifications');
        }
    }
      const handleLogout = async () => {
          const body = expoPushToken ? { expoPushToken: expoPushToken } : {};
          const response = await fetch(`${BACKEND_URL}/api/logout`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
          });
          if(!response.ok){
            const responseData = await response.json();
              handleError(throwError, responseData);
          }
          setIsSignedIn(false);
      };
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
            handleError(throwError, data);
          }
        }catch(error){
          console.error(error);
        }
      }

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
    }, [isFocused]);

    return (
        <View className="flex-1 bg-gray-100 items-center justify-center mx-2 my-1">
            <Text className="font-primary py-5 text-pink-300 text-center text-9"> Welcome to EPIC!</Text>
            {role === "Mom" ? <RequestAVolunteer /> : <HelpRequests />}
          {/* <Pressable className="my-5 w-10 h-7 bg-gray-100 border self-center rounded-md border-blue-300 border-2" onPress={handleLogout}> */}
          {/* <Pressable className="" onPress={handleLogout}> */}
          <Text className="mb-3 text-blue-600 text-6 text-center font-primary text-5 underline hover:text-blue-400 hover:font-6" onPress={handleLogout}>Logout</Text>
          {/* </Pressable> */}
        </View>
    )
}