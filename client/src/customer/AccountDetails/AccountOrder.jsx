// src/pages/Cancellation.js
import React, { useEffect, useState } from 'react';
import { getUserOrder } from '../../apiManager/methods/orderMethod';

const AccountOrder = () => {

    const [orderData, setOrderData] = useState([]);

    useEffect(() =>{
        const fetchUserOrder = async() => {
            try {
                const data = await getUserOrder();
                console.log(data)
                setOrderData(data)
            } catch (error) {
                console.log(error.message)
            }
        }

        fetchUserOrder();
    }, [])

    return (
        <div className='payment-option-container'>
            
                <div className='payment-option-header'>
                    < h1>Order</h1>
                    
                </div>
        
        </div>
    );
};

export default AccountOrder;
