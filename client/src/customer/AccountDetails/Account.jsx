import React from 'react'
import {  Outlet } from "react-router-dom";
import AccountSidebar from '../Components/AccountSidebar/AccountSidebar';
import "./Account.css"

const Account = () => {

  return (
    <div>
      <div className="account-content-wrapper">
        <AccountSidebar/>
        <div className="account-main-content">
          <Outlet/>
        </div>
      </div>

    </div>
  )
}

export default Account