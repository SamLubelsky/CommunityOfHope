import React, {useEffect, useState, useRef, useContext} from 'react';
import { ScrollView, Image, Platform, View, Text, StyleSheet, Pressable } from 'react-native';
import { useBoundStore } from '@/store/useBound';
import { Link, router } from 'expo-router';
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
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HelpModal from '@/components/HelpModal';
export default function Home(){
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const [helpVisible, setHelpVisible] = useState(false);

    const isFocused = useIsFocused();

    const role = useBoundStore((state) => state.role);
    const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();
    const throwError = useContext(ErrorContext);
    function handleRegistrationError(errorMessage: string) {
      console.log("notification error!");
      if(Platform.OS === 'android'){
        handleError(throwError, {message: `notification error: ${errorMessage}`});
      }
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
      <>

      <SafeAreaView className="flex-1">

        <ScrollView>
          <View className="rounded-full absolute top-1 right-1 z-10 bg-yellow-100 items-center justify-start mx-2 my-1">
            <Pressable onPress={()=>setHelpVisible(!helpVisible)}>
            <Ionicons name='help-outline' color="#fde047" size={48} />
            </Pressable>
          </View>
          <View className="bg-gray-100 items-center justify-start mx-2 my-1">
            <Pressable>
            </Pressable>
            <Image className="mb-5 max-w-12 max-h-10 self-center" source={require('@/assets/images/icon.png')} />
            <Text className="font-primary text-gray-500 text-center text-6 mt-2"> Powered by Community of Hope</Text>
            <Text className="text-pink-300 mb-6">"We're here to help, not judge."</Text>
            {role === "Mom" ? <RequestAVolunteer /> : <HelpRequests />}

            {/* This View ensures Logout is pushed to the bottom when content is short */}
            <View className="flex-1 justify-end w-full items-center my-4">

            </View>
          </View>
        </ScrollView>
        <Text className="mb-1 text-blue-600 text-6 text-center font-primary text-5 underline hover:text-blue-400 hover:font-6" onPress={handleLogout}>
                Logout
        </Text>
      </SafeAreaView>
      <HelpModal isVisible={helpVisible} onClose={()=>setHelpVisible(false)}/>
      </>
    )
}