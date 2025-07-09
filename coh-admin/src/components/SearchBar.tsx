import React, { useState } from 'react';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
type Props = {
    handleSearch: (searchTerm: string) => void;
}
export default function SearchBar({handleSearch}: Props){
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="mb-4 relative flex items-center space-x-2">
            <input
                type="text"
                value={searchTerm}
                onChange={(event)=> {
                    setSearchTerm(event.target.value); 
                    handleSearch(event.target.value);
                }}
                placeholder="Search chats..."
                className="w-full p-2 border border-gray-300 rounded"
            />
            <MagnifyingGlassCircleIcon className="w-10 h-10 text-gray-500 absolute right-0 top-0" onClick={()=>handleSearch(searchTerm)}/>
        </div>
    );
}