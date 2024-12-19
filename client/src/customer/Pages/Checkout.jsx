import React, { useState } from 'react';
import { useCart } from '../../CartContext.js';
import './Checkout.css';

const Checkout = () => {
  const { cartItems } = useCart(); // Access cart items from CartContext
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
  const [errors, setErrors] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Calculate the subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  // Validate the address form
  const validateAddress = () => {
    const errors = {};
    Object.entries(newAddress).forEach(([key, value]) => {
      if (!value.trim() && key !== 'address2') errors[key] = 'This field is required';
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

  // Validate payment details
  const validatePaymentDetails = () => {
    const errors = {};
    if (!paymentDetails.cardNumber.trim()) errors.cardNumber = 'Card number is required';
    if (!paymentDetails.expiry.trim()) errors.expiry = 'Expiry date is required';
    if (!paymentDetails.cvv.trim()) errors.cvv = 'CVV is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle placing the order
  const handlePlaceOrder = () => {
    if (validatePaymentDetails()) {
      alert('Order placed successfully!');
      // Add your logic for order placement here (e.g., API call)
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
                  placeholder={
                    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
                  }
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
            <div className="form-field">
              <input
                type="text"
                placeholder="Card Number"
                value={paymentDetails.cardNumber}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                }
              />
              {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
            </div>
            <div className="form-field">
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                value={paymentDetails.expiry}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, expiry: e.target.value })
                }
              />
              {errors.expiry && <span className="error">{errors.expiry}</span>}
            </div>
            <div className="form-field">
              <input
                type="text"
                placeholder="CVV"
                value={paymentDetails.cvv}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                }
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>
          </div>
          <button className="continue-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}

      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item) => (
          <div className="item" key={item.id}>
            <div>
              <p>{item.name}</p>
              <p>{item.color} / {item.size}</p>
            </div>
            <p>x {item.quantity}</p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <p>Subtotal: ${calculateSubtotal()}</p>
        <p>Shipping: {calculateSubtotal() > 140 ? 'Free' : '$10.00'}</p>
        <h3>Total: $
          {(
            parseFloat(calculateSubtotal()) + (calculateSubtotal() > 140 ? 0 : 10)
          ).toFixed(2)}
        </h3>
      </div>
    </div>
  );
};

export default Checkout;