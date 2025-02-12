// src/pages/Cancellation.js
import React from 'react';
import Image70 from '../Components/Assets/image_70.png'; // Import image from the specified path

const Cancellation = () => {

    return (
        <div>
            <div className='payment-option-container'>
                    <div className='payment-option-header'>
                        < h1>Cancellation</h1>  
                    </div>
            </div>


        <div className='no-cancellation-container'>
            <div className='smile-face-container'>
                <i class="fa-regular fa-face-smile fa-bounce fa-2xl"></i>     
                <i class="fa-regular fa-face-smile fa-bounce fa-2xl"></i> 
                <i class="fa-regular fa-face-smile fa-bounce fa-2xl"></i>  
                <i class="fa-regular fa-face-smile fa-bounce fa-2xl"></i>     
                <i class="fa-regular fa-face-smile fa-bounce fa-2xl"></i>  
            </div>

            <div>
                <h2>Great to see you're happy with your purchases! </h2>
                <h2>No Cancellation Yet</h2>
            </div>
           
        </div>
        
        </div>
    );
};

export default Cancellation;
