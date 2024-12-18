import React from 'react'
import { useAuth } from '../../authentication/authContext';
import { Navigate } from "react-router-dom";


const Account = () => {

  const { isAuthenticated, logout,user } = useAuth()

  const handleLogOut = () => {
    logout()
  };

  if (!isAuthenticated){
    return <Navigate to="/" />; // Redirect to home page
  }

  return (
    <div>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  )
}

export default Account