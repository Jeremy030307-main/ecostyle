import React, { useState } from 'react';
import './Checkout.css';

const Checkout = () => {
  const [step, setStep] = useState('shipping'); // shipping | payment
  const [addresses, setAddresses] = useState([]); // List of saved addresses
  const [cards, setCards] = useState([]); // List of saved cards
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    state: '',
    phone: '',
  });

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  // Add New Address
  const handleAddAddress = () => {
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress);
    setStep('payment'); // Proceed to payment after adding address
  };

  // Add New Card
  const handleAddCard = () => {
    setCards([...cards, newCard]);
    setSelectedCard(newCard);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* Shipping Section */}
      {step === 'shipping' && (
        <div className="shipping-section">
          <h2>Shipping</h2>
          <div className="tabs">
            <span className="active-tab">New Address</span>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              value={newAddress.firstName}
              onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newAddress.lastName}
              onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address 1"
              value={newAddress.address1}
              onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address 2"
              value={newAddress.address2}
              onChange={(e) => setNewAddress({ ...newAddress, address2: e.target.value })}
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={newAddress.postalCode}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            />
          </div>
          <button className="continue-btn" onClick={handleAddAddress}>
            Save Address & Continue
          </button>
        </div>
      )}

      {/* Payment Section */}
      {step === 'payment' && (
        <div className="payment-section">
          <h2>Payment</h2>
          <div className="tabs">
            <span className="active-tab">New Card</span>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Card Number"
              value={newCard.cardNumber}
              onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={newCard.expiry}
              onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
            />
            <input
              type="text"
              placeholder="CVV"
              value={newCard.cvv}
              onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={newCard.name}
              onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
            />
          </div>
          <button className="continue-btn" onClick={handleAddCard}>
            Save Card & Place Order
          </button>
        </div>
      )}

      {/* Saved Address & Card Summary */}
      <div className="summary-section">
        <h2>Order Summary</h2>
        {selectedAddress && (
          <div className="summary-address">
            <h3>Shipping Address:</h3>
            <p>
              {selectedAddress.firstName} {selectedAddress.lastName} <br />
              {selectedAddress.address1}, {selectedAddress.address2} <br />
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode} <br />
              {selectedAddress.phone}
            </p>
          </div>
        )}

        {selectedCard && (
          <div className="summary-card">
            <h3>Payment Method:</h3>
            <p>
              Card: **** **** **** {selectedCard.cardNumber.slice(-4)} <br />
              Expiry: {selectedCard.expiry} <br />
              Name: {selectedCard.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
