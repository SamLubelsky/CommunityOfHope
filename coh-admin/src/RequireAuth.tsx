import React, { FC, useEffect} from 'react';
import Login from "./Login.tsx";
import Cookies from 'js-cookie';
import { BACKEND_URL } from '../config';
const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
    async function verifySession(){
      const response = await fetch(`${BACKEND_URL}/api/verify-session`,{
         headers: { 'Content-Type': 'application/json' },
         method: 'POST',
         credentials: 'include',
      });
      const responseData = await response.json();
      console.log(responseData);
      if(response.ok){
         Cookies.set('SignedIn', 'true');
         return true;
      } else{
         return false;
      }
   }
    useEffect(() => {
        const checkAuth = async () => {
            console.log("authenticating...");
            if (Cookies.get('SignedIn')) {
                console.log('logged in!');
                setIsAuthenticated(true);
            } else {
                const loggedIn = await verifySession();
                setIsAuthenticated(loggedIn);
            }
        };
        checkAuth();
    }, []);    

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return children;
    }

    console.log("maybe not logged in.");
    return <Login />;
};
export default RequireAuth;