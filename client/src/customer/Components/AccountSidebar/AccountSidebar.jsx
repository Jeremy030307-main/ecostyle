import './AccountSidebar.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountSidebar = () => {
    const navigate = useNavigate();

    // Handle navigation
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="account-sidebar">
            {/* Sidebar */}
                <nav>
                    <ul>
                        <li className="account-main-option">Manage My Account
                            <ul className="account-sub-options">
                                <li>
                                    <button onClick={() => handleNavigation('./profile')}>My Profile</button>
                                </li>
                                <li>
                                    <button onClick={() => handleNavigation('./address-book')}>Address Book</button>
                                </li>
                                <li>
                                    <button onClick={() => handleNavigation('./payment-options')}>My Payment Options</button>
                                </li>
                            </ul>
                        </li>
                        <li className="main-option">My Orders
                            <ul className="sub-options">
                                <li>
                                    <button onClick={() => handleNavigation('./order')}>Order</button>
                                </li>
                                <li>
                                    <button onClick={() => handleNavigation('./cancellation')}>Cancellations</button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
        </div>
    );
};

export default AccountSidebar;
