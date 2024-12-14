import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '../config';
export default function Logout(){
    const navigate = useNavigate();
    useEffect(()=>{
        fetch(`${BACKEND_URL}/api/logout`,{
            method: 'POST', 
            credentials: 'include',
        });
        Cookies.remove('SignedIn');
        navigate("/login");
    }, []);
    return <p>Loading...</p>
}