// src/pages/Cancellation.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAccount.css'; // Import the CSS file for styling

const AccountOrder = () => {
    const navigate = useNavigate();

    // Handle navigation
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="container">
            {/* Sidebar */}
            <aside className="sidebar">
                <nav>
                    <ul>
                        <li className="main-option">Manage My Account
                            <ul className="sub-options">
                                <li>
                                    <button onClick={() => handleNavigation('/profile')}>My Profile</button>
                                </li>
                                <li>
                                    <button onClick={() => handleNavigation('/address-book')}>Address Book</button>
                                </li>
                                <li>
                                    <button onClick={() => handleNavigation('/payment-options')}>My Payment Options</button>
                                </li>
                            </ul>
                        </li>
                        <li className="main-option">My Orders
                            <ul className="sub-options">
                                <li>
                                    <button onClick={() => handleNavigation('/AccountOrder')}>Order</button>
                                </li>
                                <li>
                                    <button onClick={() => handleNavigation('/cancellation')}>Cancellations</button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                
            </main>
        </div>
    );
};

export default AccountOrder;
