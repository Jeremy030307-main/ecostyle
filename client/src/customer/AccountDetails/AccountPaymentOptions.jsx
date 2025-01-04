import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as MasterCardLogo } from "../Components/Assets/mc_symbol.svg";  // If using ReactComponent export
import { ReactComponent as VisaLogo } from "../Components/Assets/Visa_2021.svg";  // Correct path and import statement
import "./Account.css"
import { deleteClientPaymentMethod, getClientPaymentMethod } from '../../apiManager/methods/paymentMethod';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa'; // For icons

const BankCard = ({bankData, onDelete}) => {

  console.log(bankData)
  return (
    <div className='bank-card-container'>
      <div className='bank-card-info'>
        
        {/* Conditional rendering for the logo */}
        {bankData.brand === 'visa' ? (
          <VisaLogo className='bank-brand-logo' />
        ) : bankData.brand === 'mastercard' ? (
          <MasterCardLogo className='bank-brand-logo' />
        ) : (
          <div className='bank-brand-logo'>Unknown Brand</div> // Fallback for unknown brands
        )}
        <p>**** **** **** {bankData.last4}</p>
        <p>{bankData.exp_month}/{bankData.exp_year}</p>
      </div>

      <div className='bank-card-btn'>
        <button onClick={() => onDelete(bankData.id)}>Delete</button>
      </div>
    </div>
  )

}

const AccountPaymentOptions = () => {

  const [data, setData] = useState([])
  const [showStatus, setShowStatus] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();  // Initialize navigate hook
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status'); // Extract status from query parameters
  const message = queryParams.get('message'); // Extract the message if available

  const fetchPaymentMethod = async() => {
    try {
      const paymentMethods = await getClientPaymentMethod()
      setData(paymentMethods)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPaymentMethod();
  }, [])

  // Show the status container for 3 seconds
  useEffect(() => {
    if (status && message) {
      setShowStatus(true); // Show the status container

      // Navigate to the same page after 3 seconds but without the query parameters
      setTimeout(() => {
        navigate(location.pathname); // Navigate to the same path without query params
      }, 3000); // Adjust the time to your needs (3000ms = 3 seconds)
    }
  }, [status, message, navigate, location]);

  const handleDelete = async (paymentMethodId) => {
    try {
        await deleteClientPaymentMethod(paymentMethodId)
        // Update the state after successful deletion
        fetchPaymentMethod(); // Refresh payment methods

    } catch (error) {
        console.error('Error deleting payment method:', error.message);
    }
};

  return (
    <div className='payment-option-container'>
      <div className='payment-option-header'>
        < h1>Payment Options</h1>
        
        {/* Button to navigate to the AddPaymentMethod page */}
        <Link to="card-management/add"><button>Add New Payment</button> </Link>
      </div>

      {/* Conditionally render the status box if status and message are present */}
      {showStatus && status && message && (
        <div className="status-container">
          <div className={`status-box ${status}`}>
            {status === 'success' && (
              <>
                <FaCheckCircle className="status-icon success" />
                <p>{message}</p>
              </>
            )}
            {status === 'error' && (
              <>
                <FaExclamationCircle className="status-icon error" />
                <p>{message}</p>
              </>
            )}
            {status === 'info' && (
              <>
                <FaInfoCircle className="status-icon info" />
                <p>{message}</p>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className='bank-card-wrapper'>
      {data.paymentMethods && data.paymentMethods.length > 0 ? (
        data.paymentMethods.map((paymentMethod) => (
          <BankCard 
            key={paymentMethod.id} 
            bankData={paymentMethod}
            onDelete={handleDelete} 
          />
        ))
      ) : (
        <p>No payment methods available.</p> // Show a message if no payment methods exist
      )}
      </div>

    </div>
  );
};

export default AccountPaymentOptions;

