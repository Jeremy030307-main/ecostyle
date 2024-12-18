import React, { useState } from 'react';
import './Checkout.css';

const Checkout = () => {
  const [step, setStep] = useState('shipping'); // shipping | payment
  const [tab, setTab] = useState('savedAddress'); // savedAddress | newAddress
  const [addresses, setAddresses] = useState([]); // List of saved addresses
  const [selectedAddress, setSelectedAddress] = useState(null);

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

  const [cart, setCart] = useState([
    { name: 'Eco* Shorts', price: 37.50, quantity: 1 },
    { name: 'Eco* Basic Tee', price: 140.00, quantity: 1 },
  ]); // Example items in the cart

  const [errors, setErrors] = useState({}); // Validation errors

  // Function to calculate the subtotal
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  // Validate address form
  const validateAddress = () => {
    const errors = {};
    Object.entries(newAddress).forEach(([key, value]) => {
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

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* Shipping Section */}
      {step === 'shipping' && (
        <div className="shipping-section">
          <h2>Shipping</h2>
          <div className="tab-header">
            <button className={tab === 'savedAddress' ? 'active' : ''} onClick={() => setTab('savedAddress')}>
              Saved Address
            </button>
            <button className={tab === 'newAddress' ? 'active' : ''} onClick={() => setTab('newAddress')}>
              New Address
            </button>
          </div>

          {tab === 'savedAddress' && (
            <div className="saved-address-section">
              <div className="saved-address-card">
                <h3>Home</h3>
                <p>456 Elm Street, Suite 3</p>
                <p>Los Angeles, CA, 90001</p>
                <p>(601) 243-7760</p>
              </div>
              <button className="continue-btn" onClick={() => setStep('payment')}>
                Continue To Payment
              </button>
            </div>
          )}

          {tab === 'newAddress' && (
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
              <button className="continue-btn" onClick={handleAddAddress}>
                Save Address & Continue
              </button>
            </div>
          )}
        </div>
      )}

      {/* Payment Section */}
      {step === 'payment' && (
        <div className="payment-section">
          <h2>Payment Details</h2>
          <div className="form-group">
            {/* Your payment form here */}
          </div>
          <button className="continue-btn">
            Save Card & Place Order
          </button>
        </div>
      )}

      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.map((item, index) => (
          <div className="item" key={index}>
            <p>{item.name}</p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <p>Subtotal: ${calculateSubtotal()}</p>
        <p>Shipping: Free</p>
        <h3>Total: ${calculateSubtotal()}</h3>
      </div>
    </div>
  );
};

export default Checkout;
