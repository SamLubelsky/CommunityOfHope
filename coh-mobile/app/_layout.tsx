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
	const setFirstName = useBoundStore((state) => state.setFirstName);
	const setLastName = useBoundStore((state) => state.setLastName);
	const setId = useBoundStore((state) => state.setId);
	const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
	async function verifySession(){
		const response = await fetch('http://localhost:3000/api/verify-session',{
		   headers: { 'Content-Type': 'application/json' },
		   method: 'POST',
		   credentials: 'include',
		});
		const responseData = await response.json();
		console.log(responseData);
		const {firstName, lastName, userId} = responseData;
		setFirstName(firstName);
		setLastName(lastName);
		setId(userId);
		console.log("setting id: ", userId);
		if(response.ok){
		   return true;
		} else{
		   return false;
		}
	 }
	console.log("isSignedIn: ", isSignedIn);
	useEffect(() => {
		const checkAuth = async () =>{
			if(!isSignedIn){
				const signedIn = await verifySession();
				setIsSignedIn(signedIn);
			}
		}
		if (isSignedIn) {
			router.replace("/(tabs)/");
		} else {
			checkAuth();
			router.replace("/login");
		}
	}, [isSignedIn]);

	return <Slot />;
}
