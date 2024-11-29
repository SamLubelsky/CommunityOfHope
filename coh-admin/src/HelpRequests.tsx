import React, {useEffect, useState} from 'react';
type HelpRequest = {
    mom_name: string;
    volunteer_name: string;
    active: boolean;
}
export default function HelpRequests(){
    const [HelpRequests, setHelpRequests] = useState<HelpRequest[] | null>(null);
    return (
    <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-700">All Help Requests</h2>

    </div>
</div>);
}