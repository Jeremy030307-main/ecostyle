import React, { useState } from 'react';
import "./Checkout.css"
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';
import CheckoutHeader from './CheckoutHeader';

const Checkout = () => {

  return (
    <div className="checkout-container">
      <CheckoutHeader />
      <div className="checkout-body">
        <CheckoutForm />
        <OrderSummary /> 
      </div>
    </div>
  );
};

export default Checkout