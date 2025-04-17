import './index.css'
import { Link } from 'react-router-dom'
import Button from './components/Button'
import { useEffect } from 'react'
import { BACKEND_URL } from '../config'
function App() {
  useEffect(() => {
    const loadUserData = async () =>{
      const response = await fetch(`${BACKEND_URL}/api/autocomplete`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:"include",
        body: JSON.stringify({query: 'Paris'}),
      })
      console.log(response);
    }
    loadUserData();


  });
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col items-stretch w-15 p-8 gap-y-10 rounded shadow-md">
        <h1 className="text-center">Admin Dashboard</h1>
        <div className="m-auto">
          <Link to="/add-user">
            <Button label="Add A User"/>
          </Link>
        </div>
        <div className="max-w m-auto">
            <Link to="/user-list">
                <Button label="See All Users"/>
            </Link>
        </div>
        <div className="m-auto">
          <Link to="/help-history">
            <Button label="See Help Request History"/>
          </Link>
        </div>
        <div className="m-auto">
          <Link to="/logout">
            <Button label="Logout"/>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
