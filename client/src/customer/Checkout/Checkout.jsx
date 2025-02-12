import React, { useState } from 'react';
import "./Checkout.css";
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';
import CheckoutHeader from './CheckoutHeader';

const Checkout = () => {

  const [address, setAddress] = useState(null);

  return (
    <>
      <CheckoutForm address={address} setAddress={setAddress}/>
      <OrderSummary address={address}/>
    </>
  );
};

export default Checkout;
