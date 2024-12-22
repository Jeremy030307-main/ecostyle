import React, { useState } from 'react';
import { useCart } from '../../CartContext.js';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, setCartItems, calculateSubtotal } = useCart();
  const [step, setStep] = useState('shipping');
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    state: '',
    phone: '',
    tag: '',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [errors, setErrors] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [selectedTag, setSelectedTag] = useState('');
  const [activeTab, setActiveTab] = useState('saved');

  const navigate = useNavigate(); // Hook to handle page navigation

  // Reset cart when order is canceled
  const handleCancelOrder = () => {
    // Set subtotal to 0 and redirect to home
    setCartItems([]);  // This clears the cart, but you can customize it to retain items if needed
    alert('Order Canceled!');
    navigate('/'); // Redirect to home page
  };

  // Place the order after validation
  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item, index) => (
          <div key={index} className="order-item">
            <p>{item.name} - ${item.price} x {item.quantity}</p>
          </div>
        ))}
        <p>Subtotal: ${calculateSubtotal()}</p>
        <button onClick={handleCancelOrder}>Cancel Order</button>
      </div>

      {/* Payment Section */}
      <div className="payment-section">
        <h2>Payment Details</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Card Number"
            value={paymentDetails.cardNumber}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            value={paymentDetails.expiry}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="CVV"
            value={paymentDetails.cvv}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
          />
        </div>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default Checkout;
