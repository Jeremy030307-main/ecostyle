import React, { useContext, useEffect, useState } from 'react';
import "./Checkout.css";
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';
import CheckoutHeader from './CheckoutHeader';
import {useElements, useStripe } from '@stripe/react-stripe-js';
import { CheckoutContext } from './CheckoutWrapper';

const Checkout = () => {

  const {userCart} = useContext(CheckoutContext)
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const total = userCart.reduce((accumulatedTotal, cartLine) => {
    return accumulatedTotal + (cartLine.price * cartLine.quantity);
  }, 0);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout/complete",
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Payment successful!");
    }

    setIsLoading(false);
  };

  return (
    <div className="checkout-container">
      <form id="payment-form" onSubmit={handleSubmit}>
        <CheckoutHeader />
        <div className="checkout-body">
          <CheckoutForm/>
          <OrderSummary userCart={userCart} total={total} isLoading={isLoading} stripe={stripe} elements={elements} message={message} />
        </div>
      </form>
    </div>
  );
};

export default Checkout;
