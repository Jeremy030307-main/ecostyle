import React, { useState } from 'react';
import { useCart } from '../../CartContext.js';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for redirection
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

  const navigate = useNavigate(); // Hook for redirection

  // Cancel Order function: keep cart items, reset subtotal to 0 and redirect to home
  const handleCancelOrder = () => {
    alert('Order Canceled!');
    navigate('/'); // Redirect to home page
  };

  // Validate and place order
  const handlePlaceOrder = () => {
    if (validatePaymentDetails()) {
      alert('Order placed successfully!');
    }
  };

  // Validate the shipping address
  const validateAddress = () => {
    const errors = {};
    Object.entries(newAddress).forEach(([key, value]) => {
      if (!value.trim() && key !== 'address2') errors[key] = 'This field is required';
    });
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new address to saved addresses
  const handleAddAddress = () => {
    if (validateAddress()) {
      setSavedAddresses([...savedAddresses, { ...newAddress }]);
      setNewAddress({
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
      setErrors({});
    }
  };

  // Handle address selection
  const handleAddressSelection = (e) => {
    setSelectedTag(e.target.value);
  };

  // Get the filtered address based on the selected tag
  const filteredAddress = savedAddresses.find(
    (address) => address.tag === selectedTag
  );

  // Validate payment details
  const validatePaymentDetails = () => {
    const errors = {};
    const currentDate = new Date();
    const [month, year] = paymentDetails.expiry.split('/').map(num => parseInt(num));
    const expiryDate = new Date(`20${year}`, month - 1);

    if (!paymentDetails.cardNumber.trim() || isNaN(paymentDetails.cardNumber)) errors.cardNumber = 'Card number is required and should be numeric';
    if (!paymentDetails.expiry.trim() || expiryDate < currentDate) errors.expiry = 'Expiry date should not be in the past';
    if (!paymentDetails.cvv.trim() || isNaN(paymentDetails.cvv)) errors.cvv = 'CVV is required and should be numeric';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={activeTab === 'saved' ? 'active' : ''}
          onClick={() => setActiveTab('saved')}
        >
          Saved Address
        </button>
        <button
          className={activeTab === 'new' ? 'active' : ''}
          onClick={() => setActiveTab('new')}
        >
          New Address
        </button>
      </div>

      {/* Shipping Section */}
      {step === 'shipping' && (
        <div className="shipping-section">
          <h2>Shipping</h2>

          {/* Tab Content for Saved Addresses */}
          {activeTab === 'saved' && savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <select
                value={selectedTag}
                onChange={handleAddressSelection}
                disabled={savedAddresses.length === 0}
              >
                <option value="">Select Address</option>
                {savedAddresses.map((address, index) => (
                  <option key={index} value={address.tag}>
                    {address.tag}
                  </option>
                ))}
              </select>

              {filteredAddress && (
                <div className="saved-address">
                  <p>{filteredAddress.firstName} {filteredAddress.lastName}</p>
                  <p>{filteredAddress.address1}, {filteredAddress.address2}</p>
                  <p>{filteredAddress.city}, {filteredAddress.state} - {filteredAddress.postalCode}</p>
                  <p>{filteredAddress.phone}</p>
                  <span className="tag">{filteredAddress.tag}</span>
                </div>
              )}
            </div>
          )}

          {/* Tab Content for New Address */}
          {activeTab === 'new' && (
            <div className="form-group">
              {Object.entries(newAddress).map(([key, value]) => (
                key !== 'tag' && (
                  <div key={key} className="form-field">
                    <input
                      type="text"
                      placeholder={key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())
                      }
                      value={value}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, [key]: e.target.value })
                      }
                    />
                    {errors[key] && <span className="error">{errors[key]}</span>}
                  </div>
                )
              ))}
              <div className="form-field">
                <input
                  type="text"
                  placeholder="Custom Tag (e.g., Home, Work)"
                  value={newAddress.tag}
                  onChange={(e) => setNewAddress({ ...newAddress, tag: e.target.value })}
                />
              </div>
              <button onClick={handleAddAddress}>Add Address</button>
            </div>
          )}
        </div>
      )}

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
          {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            value={paymentDetails.expiry}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
          />
          {errors.expiry && <span className="error">{errors.expiry}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="CVV"
            value={paymentDetails.cvv}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
          />
          {errors.cvv && <span className="error">{errors.cvv}</span>}
        </div>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default Checkout;