import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import RequireAuth from './RequireAuth.tsx'
import Login from "./Login.tsx"
import Logout from './Logout.tsx'
import AddUser from './AddUser.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={localStorage.getItem("SignedIn") ? <Navigate to="/dashboard"/> : <Login />} />
        <Route path="/" element={localStorage.getItem("SignedIn") ? <Navigate to="/dashboard"/> : <Login />} />
        <Route path="/dashboard" element={
          <RequireAuth>
            <App />
          </RequireAuth>
        } />
        <Route path="/add-user" element={
          <RequireAuth>
            <AddUser />
          </RequireAuth>
        } />
          <Route path="/logout" element={
          <RequireAuth>
            <Logout />
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>  
  </StrictMode>
)
