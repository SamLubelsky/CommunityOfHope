import { View, Text, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from 'react';
import { useBoundStore } from '@/store/useBound';
import { Redirect, Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Page />
      <StatusBar style="light" />
    </View>
  );
}

export function Page() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const isSignedIn = useBoundStore((state) => state.isSignedIn);
  const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
  const role = useBoundStore((state) => state.role);
  const router = useRouter();
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (isSignedIn) {
  //       if(role == 'Mom'){
  //         router.replace('/requestAVolunteer');
  //       } else{
  //         router.replace('/helpRequests')
  //       }
  //     } else {
  //       router.replace('/login');
  //     }
  //   }, 0);

  //   return () => clearTimeout(timer);
  // }, [isSignedIn]);

  
  return (
    <Redirect href="/requestAVolunteer"/>
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