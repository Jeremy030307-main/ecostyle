import './MyPoints.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyPoints = () => {
    const navigate = useNavigate();

    // State for eco-points
    const [ecoPoints, setEcoPoints] = useState(0);

    // Fetch user's eco-points from API
    useEffect(() => {
        // Simulated API call to fetch eco-points
        const fetchEcoPoints = async () => {
            try {
                // Replace with actual API endpoint
                const response = await fetch('/api/eco-points');
                if (response.ok) {
                    const data = await response.json();
                    setEcoPoints(data.points); // Assume API returns { points: 1234 }
                } else {
                    console.error('Failed to fetch eco-points');
                }
            } catch (error) {
                console.error('Error fetching eco-points:', error);
            }
        };

        fetchEcoPoints();
    }, []);

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
                        <li className="main-option">Eco Points
                            <ul className="sub-options">
                                <li>
                                    <button onClick={() => handleNavigation('/points-redeem')}>Redeem Points</button>
                                </li>
                                <li>
                                    <button onClick={() => handleNavigation('/points-history')}>Transaction History</button>
                                </li>
                            </ul>
                        </li>
                        <li className="main-option">
                            <button onClick={() => handleNavigation('/my-account')}>Back to My Account</button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-con">
                <h1>My Eco Points</h1>
                <div className="points-summary">
                    <p>You currently have:</p>
                    <h2>{ecoPoints} Eco Points</h2>
                </div>
            </main>
        </div>
    );
};

export default MyPoints;
