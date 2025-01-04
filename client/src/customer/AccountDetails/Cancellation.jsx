// src/pages/Cancellation.js
import React from 'react';
import Image70 from '../Components/Assets/image_70.png'; // Import image from the specified path

const Cancellation = () => {

    return (
        <div>
            {/* Main Content */}
            <main className="main-content">
                <h1>Cancellation Page</h1>
                {/* Display the Image and Text */}
                <div className="cancellation-info">
                    <img src={Image70} alt="No Cancellations" className="cancellation-image" />
                    <p>Great to see you're happy with your purchases!</p>
                    <p>No Cancellations so far!</p>
                </div>
            </main>
        </div>
    );
};

export default Cancellation;
