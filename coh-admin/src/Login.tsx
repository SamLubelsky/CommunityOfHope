import React, {useState, useEffect} from 'react';
import InputField from './components/inputField';
import SubmitButton from './components/submitButton';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import "./index.css";
import Cookies from 'js-cookie';
export default function Login(){
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(()=>{
        if(localStorage.getItem("SignedIn")){
            console.log("you are already logged in");
            navigate("/dashboard");
        }
    }, [])
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData(event.currentTarget)
        const username = formData.get('username');
        const password = formData.get('password');
        const response = await fetch(`${BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),    
            credentials: 'include'
        });
        const responseData = await response.json();
        const {role} = responseData;
        if (!response.ok) {
            const error = responseData.message;
            console.error(error);
            setError(error);
        }
        else if(role !== "Admin"){
            console.error("ONly admins can login to the admin site");
            setError(`Only admin users can login.  Your role is ${role}`)
        }
        else{            
            Cookies.set('SignedIn', 'true');    
            console.log("redirecting");
            window.location.reload();
            localStorage.setItem("SignedIn", "true");
            console.log("you're logged in");
        }
        setIsLoading(false);
    }
    return (
        //password form made with tailwind
        
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-700">Login</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <InputField fieldName="username" fieldType="text" required displayName="Username"/>
                    <InputField fieldName="password" fieldType="password" required displayName="Password"/>
                    <SubmitButton label="Log In" isLoading={isLoading} />
                </form>
            </div>
        </div>      
    );
}