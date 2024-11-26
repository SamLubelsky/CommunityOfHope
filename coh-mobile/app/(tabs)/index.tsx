import { View, Text, StyleSheet } from "react-native";
import { useContext, useEffect } from 'react';
import { useBoundStore } from '@/store/useBound';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Slot />
      <StatusBar style="light" />
    </View>
  );
}

export function Page() {
  const isSignedIn = useBoundStore((state) => state.isSignedIn);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSignedIn) {
        router.replace('/(tabs)/requestAVolunteer');
      } else {
        router.replace('/login');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isSignedIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    backgroundColor: '#F7ACCF',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  text: {
    color: '#fff',
    fontSize: 24,
  },
});