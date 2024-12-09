import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import {
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

type User = {
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    id: string;
}
export default function Users(){
    const [usersList, setUsersList] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
        async function loadUsers(){
            const response = await fetch('http://localhost:3000/api/users',{
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                credentials: 'include'
            });
            const responseData = await response.json();
            setUsersList(responseData);
            console.log(responseData);
        }
        loadUsers();
    },[]);
    async function reloadUsers(){
        const response = await fetch('http://localhost:3000/api/users',{
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
            credentials: 'include'
        });
        const responseData = await response.json();
        setUsersList(responseData);
        console.log(responseData);
    }
    async function deleteUser(id: string){
        await fetch(`http://localhost:3000/api/users/${id}`,{
            method:'delete',
            credentials:'include'
        })
        reloadUsers();
    }
    function getFormattedList(){
        if(usersList){
            const formattedList = usersList.map((user: User, index)=>{
                const data = [user.username, user.firstName, user.lastName, user.role];
                const row = data.map((data: string, index2)=>{
                    return (
                        <p key={`user-${index}-${index2}`} className="p-2 text-gray-700 text-xl font-semibold">{data}</p>
                    );
                })
                return <>
                    {row}
                    <div>
                    <Link key={`link-1-${index}`}className="inline-block" to={{
                        pathname: "/edit-user",
                        search: `?id=${user.id}`
                    }}>
                    <PencilSquareIcon key={`pencil-${index}`} className="h-6 w-6 text-blue-300 hover:text-blue-500"/>
                    </Link>
                    </div>
                    <div>
                    {/* <Link key={`link-2-${index}`} className="inline-block" to={{
                        pathname:"/delete-user",
                        search: `?id=${user.id}`
                        }}> */}
                    <a className="inline-block hover:cursor-pointer" onClick={()=>deleteUser(user.id)}>
                    <TrashIcon key={`trash-${index}`} className="h-6 w-6 text-red-300 hover:text-red-500"/>
                    </a>
                    {/* </Link> */}
                    </div>
                </>
        })
            return  <div className="grid grid-cols-6    ">
                    <p key='th-1' className="p-2 text-gray-700 text-xl font-semibold">Username</p>
                    <p key='th-2' className="p-2 text-gray-700 text-xl font-semibold">First Name</p>
                    <p key='th-3' className="p-2 text-gray-700 text-xl font-semibold">Last Name</p>
                    <p key='th-4' className="p-2 text-gray-700 text-xl font-semibold">Role</p>
                    <p key='th-5' className="p-2 text-gray-700 text-xl font-semibold">Edit User</p>
                    <p key='th-6' className="p-2 text-gray-700 text-xl font-semibold">Delete User</p>
                    {formattedList}
                    </div>
        } else{
            return <p className="font-semibold text-xl"> No users have been added yet</p>
        }
    }
    return (
    <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-8xl p-8 space-y-6 bg-white rounded shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-700">List of All Users</h2>
            {getFormattedList()}
                <div className="flex flex-col gap-y-5">
                <div className="m-auto">
                    <Link to="/dashboard">
                        <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
                            Back to Dashboard
                        </button>
                    </Link>
                </div>
                <div className="m-auto">
                    <button onClick={() =>navigate("/add-user")} className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
                        Add A New User
                    </button>
                </div>
                </div>
        </div>
    </div>    
    ); 
}