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

  const [errors, setErrors] = useState({}); // Validation errors

  // Validate address form
  const validateAddress = () => {
    const errors = {};
    Object.entries(newAddress).forEach(([key, value]) => {
      if (!value.trim()) errors[key] = 'This field is required';
    });
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate card form
  const validateCard = () => {
    const errors = {};
    Object.entries(newCard).forEach(([key, value]) => {
      if (!value.trim()) errors[key] = 'This field is required';
    });
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add New Address
  const handleAddAddress = () => {
    if (validateAddress()) {
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress);
      setStep('payment'); // Proceed to payment after adding address
      setErrors({});
    }
  };

  // Add New Card
  const handleAddCard = () => {
    if (validateCard()) {
      setCards([...cards, newCard]);
      setSelectedCard(newCard);
      alert('Order placed successfully!');
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* Shipping Section */}
      {step === 'shipping' && (
        <div className="shipping-section">
          <h2>Shipping Address</h2>
          <div className="form-group">
            {Object.entries(newAddress).map(([key, value]) => (
              <div key={key} className="form-field">
                <input
                  type="text"
                  placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  value={value}
                  onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                />
                {errors[key] && <span className="error">{errors[key]}</span>}
              </div>
            ))}
          </div>
          <button className="continue-btn" onClick={handleAddAddress}>
            Save Address & Continue
          </button>
        </div>
      )}

      {/* Payment Section */}
      {step === 'payment' && (
        <div className="payment-section">
          <h2>Payment Details</h2>
          <div className="form-group">
            {Object.entries(newCard).map(([key, value]) => (
              <div key={key} className="form-field">
                <input
                  type="text"
                  placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  value={value}
                  onChange={(e) => setNewCard({ ...newCard, [key]: e.target.value })}
                />
                {errors[key] && <span className="error">{errors[key]}</span>}
              </div>
            ))}
          </div>
          <button className="continue-btn" onClick={handleAddCard}>
            Save Card & Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
