import { useBoundStore } from '@/store/useBound';
import { router, Slot, Stack, Tabs } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';
import {BACKEND_URL} from './config';
import "../global.css"
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
	const setRole = useBoundStore((state) => state.setRole);
	async function verifySession(){

		const response = await fetch(`${BACKEND_URL}/api/verify-session`,{
		   headers: { 'Content-Type': 'application/json' },
		   method: 'POST',
		   credentials: 'include',
		});

		if(response.ok){

			const responseData = await response.json();
			const {firstName, lastName, userId, role} = responseData;
			setFirstName(firstName);
			setLastName(lastName);
			setId(userId);
			setRole(role);
		    return true;
		   
		} else{

		   return false;

		}

	 }
	// console.log("isSignedIn: ", isSignedIn);
	useEffect(() => {
		
		const checkAuth = async () =>{
			if(!isSignedIn){
				const signedIn = await verifySession();
				setIsSignedIn(signedIn);
			}
		}


		if (isSignedIn) {

			router.replace("/(tabs)");

		} else {
			
			checkAuth();
			router.replace("/login");
			
		}

	}, [isSignedIn]);

	return (
		<Slot />
	);
}
