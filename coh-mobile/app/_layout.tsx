import { useBoundStore } from '@/store/useBound';
import { router, Slot, Stack } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("light");
    }, 0);
  }, []);

  return AuthNavigator();
}

function AuthNavigator() {
	const isSignedIn = useBoundStore((state) => state.isSignedIn);
	console.log("isSignedIn: ", isSignedIn);
	useEffect(() => {
		if (isSignedIn) {
			router.replace("/(tabs)");
		} else {
			router.replace("/login");
		}
	}, [isSignedIn]);

	return <Slot />;
}
