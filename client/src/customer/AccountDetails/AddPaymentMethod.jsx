import React, { useEffect, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { ApiMethods } from '../../apiManager/ApiMethods';
import "./Account.css"

const AddPaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();
  
    const [clientSecret, setClientSecret] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false); // State for loading spinner
  
    useEffect(() => {
      // Fetch the clientSecret when the page loads
      const fetchClientSecret = async () => {
        try {
          const response = await ApiMethods.get('/payment/secret'); // Your backend API to get clientSecret
          setClientSecret(response.client_secret);
        } catch (error) {
          console.error('Error fetching client secret:', error);
          setErrorMessage('Failed to load payment form.');
        }
      };
  
      fetchClientSecret();
    }, []);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        setErrorMessage('Stripe.js has not loaded yet. Please try again later.');
        return;
      }
      setLoading(true); // Show loading spinner

      const {error} = await stripe.confirmSetup({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account/payment-options/card-management/success`,
        },
      });
  
      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setErrorMessage(error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    };
  
  return (
    <div className='payment-option-container'>

    <div className='payment-option-header'>
      < h1>Add a New Card</h1>
    </div>

    {/* Show error message if there's any */}
    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

    {/* Show loading spinner */}
    {loading && <div>Loading...</div>}

    {/* Display the payment form */}
    {clientSecret ? (
      <form className="card-detail-form" onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={!stripe || loading}>
          Submit
        </button>
      </form>
    ) : !loading ? (
      <div>Loading payment form...</div>
    ) : null}
  </div>

  );
};

export default AddPaymentForm;
