import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../config';
type HelpRequest = {
    mom_name: string;
    volunteer_name: string;
    active: boolean;
}
export default function HelpRequests(){
    const [HelpRequests, setHelpRequests] = useState<HelpRequest[] | null>(null);
    useEffect(()=>{
        async function loadRequests(){
            const response = await fetch(`${BACKEND_URL}/api/help_requests`,{
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                credentials: 'include'
            });
            const responseData = await response.json();
            setHelpRequests(responseData.Requests);
            console.log(responseData);
        }
        loadRequests();
    },[]);
    function getFormattedList(){
        if(HelpRequests){
            const formattedList = HelpRequests.map((helpRequest: HelpRequest, index)=>{
                return <>
                    <p key={`user-${index}-0`} className="p-2 text-gray-700 text-xl font-semibold">{helpRequest.mom_name}</p>
                    <p key={`user-${index}-1`} className="p-2 text-gray-700 text-xl font-semibold">{helpRequest.volunteer_name}</p>
                    helpRequest.active ? <p key={`user-${index}-2`} className="p-2 text-red-700 text-xl font-semibold">Yes</p> 
                    : <p key={`user-${index}-2`} className="p-2 text-red-700 text-xl font-semibold">No</p>
                </>
        })
            return  <div className="grid grid-cols-3">
                    <p key='th-1' className="p-2 text-gray-700 text-xl font-semibold">Mom</p>
                    <p key='th-2' className="p-2 text-gray-700 text-xl font-semibold">Volunteer</p>
                    {/* <p key='th-3' className="p-2 text-gray-700 text-xl font-semibold">Description</p> */}
                    <p key='th-4' className="p-2 text-gray-700 text-xl font-semibold">Completed?</p>
                    {/* <p key='th-5' className="p-2 text-gray-700 text-xl font-semibold">Date Created</p> */}
                    {formattedList}
                    </div>
        } else{
            return <p className="font-semibold text-xl"> No help requests have been created yet</p>
        }
    }
    return (
    <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-700">All Help Requests</h2>
        {getFormattedList()}
        <div className="flex flex-col gap-y-5">
            <div className="m-auto">
                <Link to="/dashboard">
                    <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
                        Back to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    </div>
</div>);
}