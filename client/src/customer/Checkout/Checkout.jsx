import React, { useState } from 'react';
import "./Checkout.css";
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';
import CheckoutHeader from './CheckoutHeader';

const Checkout = () => {

  const [address, setAddress] = useState(null);
  const [card, setCard] = useState(null);

  return (
    <>
      <CheckoutForm address={address} setAddress={setAddress} card={card} setCard={setCard}/>
      <OrderSummary address={address} card={card}/>
    </>
  );
};

export default Checkout;
