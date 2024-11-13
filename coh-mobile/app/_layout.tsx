import { Stack } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("light");
    }, 0);
  }, []);

  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="not-found" />
    </Stack>
  );
}