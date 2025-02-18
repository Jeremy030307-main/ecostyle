import React from 'react';
import "./Checkout.css";
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';
import CheckoutHeader from './CheckoutHeader';

const Checkout = () => {

  return (

    <div className="checkout-container">
      <div id="payment-form">
        <CheckoutHeader />
        <div className="checkout-body">
          <CheckoutForm />
          <OrderSummary/>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
