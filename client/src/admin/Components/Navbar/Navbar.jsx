import React from 'react'
import {assets} from '../Assets/assets'
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationManager from '../../../authentication/authenticationManager';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Show confirmation dialog
        const confirmed = window.confirm("Are you sure you want to log out?");
        
        if (confirmed) {
            const success = await AuthenticationManager.signOut();
            if (success) {
                // Redirect to login page after successful logout
                navigate('/login');
            }
        }
    };
    return (
        <div className='navbar-container'>
            <img src={assets.logo_text} alt ="" />
            <Link to='../Login'>
                <button onClick={handleLogout} className='logout-btn'>Logout</button>
            </Link>
        </div>
    )
}

export default Navbar