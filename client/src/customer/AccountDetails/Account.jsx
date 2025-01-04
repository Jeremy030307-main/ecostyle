import React from 'react'
import { useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import AuthenticationManager from '../../authentication/authenticationManager';
import AccountSidebar from '../Components/AccountSidebar/AccountSidebar';
import "./Account.css"

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
      <div className="account-content-wrapper">
        <AccountSidebar/>
        <div className="account-main-content">
          <Outlet/>
        </div>
      </div>
      {/* <button onClick={handleLogOut}>LogOut</button> */}

    </div>
  )
}

export default Account