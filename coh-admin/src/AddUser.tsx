import React, {useState, useRef} from 'react';
import InputField from './components/inputField';
import SubmitButton from './components/submitButton';
import {Link} from 'react-router-dom';
import SelectField from './components/selectField';
import { BACKEND_URL } from '../config';
import ImageField from './components/imageField';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const roleOptions = ['Mom','Volunteer','Admin']
export default function AddUser(){
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();
    function resetForm(){
        setAddSuccess(false);
        if(formRef.current){
            formRef.current.reset();
        }
    }
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData(event.currentTarget)
        const response = await fetch(`${BACKEND_URL}/api/users`,{
            method:'POST',
            credentials:"include",
            body: formData,
        });
        try{
            const responseData = await response.json();
            if (!response.ok) {
                if(response.status === 401){
                    Cookies.remove("SignedIn");
                    navigate("/login");
                    return;
                }
                const error = responseData.message;
                setError(error);
            }   
            else{                
                setAddSuccess(true);
            }
            setIsLoading(false);
            console.log(responseData);
        } catch(error){
            console.error(error);
            setError("An unknown error occurred. Please refresh the page and try again.");
            setIsLoading(false);
        }
    }
    return  (
    <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-700">Add a New User</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                <InputField fieldName="username" fieldType="text" required displayName="Username"/>
                <InputField fieldName="password" fieldType="password" required displayName="Password"/>
                <InputField fieldName="firstName" fieldType="text" required displayName="First Name"/>
                <InputField fieldName="lastName" fieldType="text" required displayName="Last Name"/>
                <ImageField fieldName="profilePic" required displayName="Profile Picture"/>
                <SelectField fieldName='role' required displayName='Role' defaultValue="Mom" options={roleOptions}/>
                <SubmitButton label="Add New User" isLoading={isLoading} />
            </form>
            <div className="flex flex-col gap-y-5">
                {addSuccess && 
                <>
                <p className="text-green-500 font-semibold">User added succesfully</p>
                <div className="m-auto">
                    <button onClick={()=>resetForm()} className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
                        Add Another User
                    </button>
                </div>
                </>
                }
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