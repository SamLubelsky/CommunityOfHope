import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
export default function Logout(){
    const navigate = useNavigate();
    useEffect(()=>{
        fetch('http://localhost:3000/api/logout',{
            method: 'delete',
        });
        localStorage.removeItem("SignedIn");
        navigate("/login");
    }, []);
    return <p>Loading...</p>
}