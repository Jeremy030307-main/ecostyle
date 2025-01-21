import { useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPaymentStatus = () => {
    const stripe = useStripe();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState(null);
  
    useEffect(() => {
      const clientSecret = new URLSearchParams(window.location.search).get('setup_intent_client_secret');
  
      if (!clientSecret) {
        navigate('/error?status=missing_client_secret'); // Redirect with a status parameter
        return;
      }
  
      if (!stripe) {
        return;
      }
  
      stripe
        .retrieveSetupIntent(clientSecret)
        .then(({ setupIntent }) => {
          switch (setupIntent.status) {
            case 'succeeded':
              setStatus('success');
              setMessage('Your payment method has been successfully added!');
              navigate(`/account/payment-options?status=success&message=${encodeURIComponent('Your payment method has been successfully added!')}`);
              break;
            case 'processing':
              setStatus('processing');
              setMessage('Your payment is still being processed. Please wait...');
              break;
            case 'requires_payment_method':
              setStatus('error');
              setMessage('We were unable to process your payment. Please try another method.');
              navigate(`/account/payment-options?status=failed_payment_method&message=${encodeURIComponent('We were unable to process your payment. Please try another method.')}`);
              break;
            default:
              setStatus('error');
              setMessage('Unexpected error occurred. Please try again later.');
              navigate(`/account/payment-options?status=unexpected_status&message=${encodeURIComponent('Unexpected error occurred. Please try again later.')}`);
              break;
          }
        })
        .catch((error) => {
          const errorMessage = `Error retrieving payment status: ${error.message}`;
          setStatus('error');
          setMessage(errorMessage);
          console.error(errorMessage);
          navigate(`/error?status=api_error&message=${encodeURIComponent(errorMessage)}`);
        });
    }, [stripe, navigate]);
  
    // UI rendering
    return (
      <div className="status-container">
        <h1>Payment Status</h1>
        {status === 'processing' && (
          <div className="status-box processing">
            <p>{message}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default AddPaymentStatus;
