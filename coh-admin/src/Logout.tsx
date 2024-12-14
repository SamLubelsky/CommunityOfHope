import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
export default function Logout(){
    const navigate = useNavigate();
    const BACKEND_URL = process.env.BACKEND_URL;
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