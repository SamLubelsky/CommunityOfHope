import { useState } from 'react'
import './index.css'
import SubmitButton from './components/submitButton'
import { Link } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col w-15 p-8 gap-y-10 rounded shadow-md">
        <h1 className="text-center">Admin Dashboard</h1>
        <div className="m-auto">
          <Link to="/add-user">
            <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
              Add A User
            </button>
          </Link>
        </div>
        <div className="m-auto">
          <Link to="/help-history">
            <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
              See Help Request History
            </button>
          </Link>
        </div>
        <div className="m-auto">
          <Link to="/logout">
            <button className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl">
              Logout
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
