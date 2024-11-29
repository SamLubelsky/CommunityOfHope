import { useState } from 'react'
import './index.css'
import SubmitButton from './components/submitButton'
import { Link } from 'react-router-dom'
import Button from './components/Button'
function App() {
  const [count, setCount] = useState(0)

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
