import React, { FC} from 'react';
import { useLocation } from 'react-router-dom';
import {Navigate, Route} from 'react-router-dom';
import Login from "./Login.tsx";
const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
   //  const userIsLogged = useLoginStatus(); // Your hook to get login status   
   // const {state} = useLocation();
    console.log("authenticating...");
    if (localStorage.getItem("SignedIn")){
       console.log('logged in!');  
       return children; 
    }
    console.log("not logged in.");
    return <Login />
 };
export default RequireAuth;