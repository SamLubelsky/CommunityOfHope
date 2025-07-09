import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
import SearchBar from './components/SearchBar';
import Fuse from 'fuse.js';
type Chat = {
    momName: string;
    volunteerName: string;
}
export default function ChatHistory(){
    const navigate = useNavigate();
    const [chats, setChats] = useState<Chat[] | null>(null);
    const [filteredChats, setFilteredChats] = useState<Chat[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        async function fetchChats(){
            const response = await fetch(`${BACKEND_URL}/api/chats/all`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                credentials: 'include'
            });
            const responseData = await response.json();
            if(!response.ok){
                console.log("Error fetching chat data:", responseData.message);
                if(response.status === 401){
                    Cookies.remove("SignedIn");
                    navigate("/login");
                    return;
                }
                setError(responseData.message);
                return;
            }
            // setChats(responseData.chats);
            console.log(responseData);
            setChats(responseData);
        }
        if(!chats){
            fetchChats();
        }
    })
    const handleSearch = (searchTerm: string) => {
        console.log("Searching for:", searchTerm);
        const filteredChats = getChatsSearch(searchTerm);
        setFilteredChats(filteredChats);
    }
    const getChatsSearch = (term: string): Chat[] => {
        //perform fuzzy matching with mom name and volunter name, using fast-fuzzy algorithm
        if(!chats){
            console.log("No chats available, returning empty array.");
            return [];
        }
        if(term.trim() === ''){
            console.log("No search term provided, returning all chats.");
            return chats;
        }
        const fuse = new Fuse(chats, {
            keys: ['momName', 'volunteerName'],
            threshold: 0.4,
        })
        const results = fuse.search(term);
        return results.map(result => result.item);
        const lowerTerm = term.toLowerCase();
        return chats.filter(chat => 
            chat.momName.toLowerCase().includes(lowerTerm) || 
            chat.volunteerName.toLowerCase().includes(lowerTerm)
        );
    }
    const ChatDisplay = (chat: Chat, index: number) => {
        return (
            <div key={`chat-${index}`} className="p-4 border-b border-gray-200">
                <p className="text-lg font-semibold text-gray-800">{chat.momName}</p>
                <p className="text-md text-gray-600">{chat.volunteerName}</p>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-700">Chat History</h2>
            <SearchBar handleSearch={handleSearch}/>
            {filteredChats?.map((chat, index) => ChatDisplay(chat, index))}
                <div className="mt-6">
                    <Link to="/dashboard" className="flex items-center justify-center">
                        <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
                            Back to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </div>
);
}