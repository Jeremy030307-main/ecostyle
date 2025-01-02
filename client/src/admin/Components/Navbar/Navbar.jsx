import React, { useState } from "react";
import { assets } from "../Assets/assets";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationManager from "../../../authentication/authenticationManager";
import AlertDialog from "../AlertDialog/AlertDialog";

const Navbar = () => {
  const navigate = useNavigate();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleLogout = () => {
    // Open the alert dialog
    setIsAlertOpen(true);
  };

  const handleConfirmLogout = async () => {
    const success = await AuthenticationManager.signOut();
    console.log(success);
    if (success) {
      navigate("/login");
    }
    setIsAlertOpen(false);
  };

  return (
    <div className="navbar-container">
      <img src={assets.logo_text} alt="" />

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => handleConfirmLogout()}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
      />
      <button onClick={() => handleLogout()} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
