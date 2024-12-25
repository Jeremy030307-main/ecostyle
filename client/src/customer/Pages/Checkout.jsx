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

  const navigate = useNavigate();

  const handleCancelOrder = () => {
    alert('Order Canceled!');
    navigate('/');
  };

  const handlePlaceOrder = () => {
    if (validatePaymentDetails()) {
      alert('Order placed successfully!');
      setCartItems([]);
    }
  };

  const validateAddress = () => {
    const errors = {};
    Object.entries(newAddress).forEach(([key, value]) => {
      if (!value.trim() && key !== 'address2') errors[key] = 'This field is required';
    });
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const handleAddressSelection = (e) => {
    setSelectedTag(e.target.value);
  };

  const filteredAddress = savedAddresses.find(
    (address) => address.tag === selectedTag
  );

  const validatePaymentDetails = () => {
    const errors = {};
    const currentDate = new Date();
    const [month, year] = paymentDetails.expiry.split('/').map(num => parseInt(num));
    const expiryDate = new Date(`20${year}`, month - 1);

    if (!paymentDetails.cardNumber.trim() || isNaN(paymentDetails.cardNumber)) errors.cardNumber = 'Invalid credit card number';
    if (!paymentDetails.expiry.trim() || expiryDate < currentDate) errors.expiry = 'Card has expired. Please enter a valid expiry date';
    if (!paymentDetails.cvv.trim() || isNaN(paymentDetails.cvv)) errors.cvv = 'Invalid CVV';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Address
        </button>
        <button
          className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Address
        </button>
      </div>

      {step === 'shipping' && (
        <div className="shipping-section">
          <h2>Shipping</h2>

          {activeTab === 'saved' && savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <select
                value={selectedTag}
                onChange={handleAddressSelection}
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

          {activeTab === 'new' && (
            <div className="form-group">
              {Object.entries(newAddress).map(([key, value]) => (
                key !== 'tag' && (
                  <div key={key} className="form-group">
                    <input
                      type="text"
                      placeholder={
                        {
                          firstName: 'First Name',
                          lastName: 'Last Name',
                          address1: 'Address Line 1',
                          address2: 'Address Line 2 ',
                          city: 'City',
                          postalCode: 'Postal Code',
                          state: 'State',
                          phone: 'Phone Number',
                        }[key]
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

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Custom Tag (e.g., Home, Work)"
                  value={newAddress.tag}
                  onChange={(e) => setNewAddress({ ...newAddress, tag: e.target.value })}
                />
              </div>
              <button className="add-address-btn" onClick={handleAddAddress}>Add Address</button>
            </div>
          )}
        </div>
      )}

      <div className="cart-order-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item) => (
          <div className="item" key={item.id}>
            <div className="item-info">
              <img src={item.imageUrl} alt={item.name} className="item-image" />
              <div>
                <p>{item.name}</p>
                <p>{item.color} / {item.size}</p>
              </div>
            </div>
            <p>x {item.quantity}</p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <p>Subtotal: ${calculateSubtotal()}</p>
        <p>Shipping: {calculateSubtotal() > 140 ? 'Free' : '$10.00'}</p>
        <div className="order-total">
          <h3>Total: $
            {(
              parseFloat(calculateSubtotal()) + (calculateSubtotal() > 140 ? 0 : 10)
            ).toFixed(2)}
          </h3>
        </div>
        <div className="cancel-order">
          <button onClick={handleCancelOrder}>Cancel Order</button>
        </div>
      </div>

      <div className="payment-details">
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
