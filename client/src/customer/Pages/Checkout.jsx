import React, { useState, useEffect } from 'react';
import './Checkout.css'; // Make sure to update this CSS file

const Checkout = () => {
  const [step, setStep] = useState('shipping'); // 'shipping' | 'payment'
  const [tab, setTab] = useState('newAddress'); // Only allow new addresses
  const [addresses, setAddresses] = useState([]); // List of saved addresses (will be empty)
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

  const [cart, setCart] = useState([]); // Initially empty cart
  const [errors, setErrors] = useState({});

  // Fetch dynamic cart items (example from localStorage or API)
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // Calculate the subtotal
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  // Validate the address form
  const validateAddress = () => {
    const errors = {};
    Object.entries(newAddress).forEach(([key, value]) => {
      if (!value.trim()) errors[key] = 'This field is required';
    });
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    if (validateAddress()) {
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress);
      setStep('payment'); // Move to the payment section after adding the address
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
            <button className={tab === 'newAddress' ? 'active' : ''}>
              New Address
            </button>
          </div>

          {/* New Address Form */}
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
        </div>
      )}

      {/* Payment Section */}
      {step === 'payment' && (
        <div className="payment-section">
          <h2>Payment Details</h2>
          <div className="form-group">
            {/* Payment form (leave blank for now) */}
          </div>
          <button className="continue-btn">
            Save Card & Place Order
          </button>
        </div>
      )}

      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div className="item" key={index}>
              <p>{item.name}</p>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))
        )}
        <p>Subtotal: ${calculateSubtotal()}</p>
        <p>Shipping: Free</p>
        <h3>Total: ${calculateSubtotal()}</h3>
      </div>
    </div>
  );
};

export default Checkout;
