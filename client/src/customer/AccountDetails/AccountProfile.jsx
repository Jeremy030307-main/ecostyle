import React, { useEffect } from 'react'
import { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import AuthenticationManager, { useAuth } from '../../authentication/authenticationManager';
import "./Account.css"
import { getUser } from '../../apiManager/methods/userMethods';

const AccountProfile = () => {


  const [userData, setUserData] = useState(null)
  const { isAuthenticated, userSignOut } = useAuth();
  const navigate = useNavigate()


  useEffect(() => {
    const fetchUserData = async() => {
      const data = await getUser();
      console.log(data)
      setUserData(data)
    }

    fetchUserData()
  }, [])

  if (isAuthenticated === false) {
    return <Navigate to="/" />; // Redirect to home page
  }


  return (
    <div className='payment-option-container'>

      <div className='payment-option-header'>
        < h1>Profile</h1>
      </div>

    <div>

    <div className='account-personal-detail'>
      {userData ? (
        <>
          <div className='account-personal-title-content'>
            <h2>Name</h2>
            <h3>{userData.displayName}</h3>
          </div>

          <div className='account-personal-title-content'>
            <h2>Email</h2>
            <h3>{userData.email}</h3>
          </div>

          {userData.phone ? (
            <div className='account-personal-title-content'>
              <h2>Phone</h2>
              <h3>{userData.phone}</h3>
            </div>
          ) : null}

        <div className='account-detail-button-container'>
          <button className='account-detail-button edit' onClick={() => {navigate("./update-profile")}}>Edit</button>
          <button className='account-detail-button delete' onClick={() => userSignOut()}>Log Out</button>
        </div>
        </>
      ): (
        <>Loading ...</>
      )}
      </div>

    </div>

    <div className=' account-password-container'>
      <div className='account-personal-title-content'>
        <h2>Password</h2>
        <h3>********</h3>
      </div>

      {/* <div className='account-detail-button-container'>
          <button className='account-detail-button change-password'>Change Password</button>
      </div> */}
    </div>

    </div>
  )
}

export default AccountProfile