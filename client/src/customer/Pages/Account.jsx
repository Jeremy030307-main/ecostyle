import React from 'react'
import { useState } from 'react';
import { Navigate } from "react-router-dom";
import AuthenticationManager from '../../authentication/authenticationManager';

const Account = () => {

  const [isAuthenticated,setAuthentication] = useState(true);

  const handleLogOut = async () => {
    await AuthenticationManager.signOut()

    AuthenticationManager.auth.onAuthStateChanged((user) => {
      if (user) {
        if (!user.isAnonymous){
          setAuthentication(true);
        } else {
          setAuthentication(false);
        }
      } else {
        setAuthentication(false);
      }
    });
  };

  if (isAuthenticated === false) {
    return <Navigate to="/" />; // Redirect to home page
  }

  return (
    <div>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  )
}

export default Account