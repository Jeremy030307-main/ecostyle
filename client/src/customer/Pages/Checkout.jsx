import React, { useState, useEffect } from 'react';
import './Checkout.css';

const Checkout = () => {
  const [step, setStep] = useState('shipping'); // 'shipping' | 'payment'
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

  // Fetch dynamic cart items
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
          <button className="continue-btn">Save Card & Place Order</button>
        </div>
      )}

      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.map((item) => (
          <div className="item" key={item.id}>
            <p>{item.name}</p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <p>Subtotal: ${calculateSubtotal()}</p>
        <p>Shipping: {calculateSubtotal() > 140 ? 'Free' : '$10.00'}</p>
        <h3>Total: ${
          (parseFloat(calculateSubtotal()) + (calculateSubtotal() > 140 ? 0 : 10)).toFixed(2)
        }</h3>
      </div>
    </div>
  );
};

export default Checkout;
