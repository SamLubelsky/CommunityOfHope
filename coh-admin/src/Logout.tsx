import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
export default function Logout(){
    const navigate = useNavigate();
    useEffect(()=>{
        fetch('http://localhost:3000/api/logout',{
            method: 'POST', 
            credentials: 'include',
        });
        Cookies.remove('SignedIn');
        navigate("/login");
    }, []);
    return <p>Loading...</p>
}