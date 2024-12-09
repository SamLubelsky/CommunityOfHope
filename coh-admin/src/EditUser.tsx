import React, {useEffect, useState, useRef,} from 'react';
import InputField from './components/inputField';
import SubmitButton from './components/submitButton';
import { Link, useSearchParams} from 'react-router-dom';
type User = {
    username: string;
    firstName: string;
    lastName: string;
    id: string;
}
export default function EditUser(){
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [searchParams] = useSearchParams();
    const [userData, setUserData] = useState<User | null>(null);
    const id = searchParams.get("id");
    const [success, setSuccess] = useState(null);
    useEffect(()=>{
        const loadUserData = async () =>{
            const response = await fetch(`http://localhost:3000/api/users/${id}`,{
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials:"include",
            })
            const responseData = await response.json();
            setUserData(responseData);
        }
        if(!userData){
            loadUserData();
        }
    })
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData(event.currentTarget)
        const user = formData.get('username');
        const password = formData.get('password');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const response = await fetch(`http://localhost:3000/api/users/${id}`,{
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials:"include",
            body: JSON.stringify({ user, password, firstName, lastName}),
        });
        const responseData = await response.json();
        if (!response.ok) {
            const error = responseData.message;
            console.error(error);
            setError(error);
        }   
        else{                
            setSuccess(responseData.message);
        }
        setIsLoading(false);
        console.log(responseData);
    }
    return  (
    <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-700">Edit User Info</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {userData && 
            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                <InputField fieldName="username" fieldType="text" required displayName="Username" defaultValue={userData.username}/>
                <InputField fieldName="password" fieldType="password" required displayName="Password" placeholder={"You must make a new password"}/>
                <InputField fieldName="firstName" fieldType="text" required displayName="First Name" defaultValue={userData.firstName}/>
                <InputField fieldName="lastName" fieldType="text" required displayName="Last Name" defaultValue={userData.lastName}/>
                <SubmitButton label="Edit User Info" isLoading={isLoading} />
            </form>
            }
            {success && <p className="text-green-500 font-semibold">User data edited succesfully</p>}
            <div className="flex flex-col gap-y-5">
                <div className="m-auto">
                    <Link to="/dashboard">
                        <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
                            Back to Dashboard
                        </button>
                    </Link>
                </div>
                <div className="m-auto">
                    <Link to="/user-list">
                        <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
                            See all Users
                        </button>
                    </Link>
                </div>
            </div>  
        </div>
    </div>
    );
}