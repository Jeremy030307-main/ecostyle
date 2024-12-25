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
          className={`tab-button ${step === 'shipping' ? 'active' : ''}`}
          onClick={() => setStep('shipping')}
        >
          Shipping Address
        </button>
        <button
          className={`tab-button ${step === 'payment' ? 'active' : ''}`}
          onClick={() => setStep('payment')}
        >
          Payment Details
        </button>
        <button
          className={`tab-button ${step === 'summary' ? 'active' : ''}`}
          onClick={() => setStep('summary')}
        >
          Order Summary
        </button>
      </div>

      {step === 'shipping' && (
        <div className="section">
          <h2>Shipping Address</h2>
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Addresses
            </button>
            <button
              className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              Add New Address
            </button>
          </div>

          {activeTab === 'saved' && savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <div className="form-group">
                <label>Choose a Saved Address:</label>
                {savedAddresses.map((address, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      name="address"
                      value={address.tag}
                      checked={selectedTag === address.tag}
                      onChange={handleAddressSelection}
                    />
                    <span>{`${address.firstName} ${address.lastName}, ${address.address1}, ${address.city}, ${address.state}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="add-address">
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={newAddress.firstName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, firstName: e.target.value })
                  }
                />
                {errors.firstName && <div className="error">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={newAddress.lastName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, lastName: e.target.value })
                  }
                />
                {errors.lastName && <div className="error">{errors.lastName}</div>}
              </div>
              <div className="form-group">
                <label>Address Line 1:</label>
                <input
                  type="text"
                  value={newAddress.address1}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address1: e.target.value })
                  }
                />
                {errors.address1 && <div className="error">{errors.address1}</div>}
              </div>
              <div className="form-group">
                <label>Address Line 2 (optional):</label>
                <input
                  type="text"
                  value={newAddress.address2}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address2: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                {errors.city && <div className="error">{errors.city}</div>}
              </div>
              <div className="form-group">
                <label>State:</label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                {errors.state && <div className="error">{errors.state}</div>}
              </div>
              <div className="form-group">
                <label>Postal Code:</label>
                <input
                  type="text"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                />
                {errors.postalCode && <div className="error">{errors.postalCode}</div>}
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                />
                {errors.phone && <div className="error">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label>Address Tag:</label>
                <input
                  type="text"
                  value={newAddress.tag}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, tag: e.target.value })
                  }
                />
                {errors.tag && <div className="error">{errors.tag}</div>}
              </div>
              <button className="add-address-btn" onClick={handleAddAddress}>
                Add Address
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'payment' && (
        <div className="section">
          <h2>Payment Details</h2>
          <div className="form-group">
            <label>Card Number:</label>
            <input
              type="text"
              value={paymentDetails.cardNumber}
              onChange={(e) =>
                setPaymentDetails({
                  ...paymentDetails,
                  cardNumber: e.target.value,
                })
              }
            />
            {errors.cardNumber && <div className="error">{errors.cardNumber}</div>}
          </div>
          <div className="form-group">
            <label>Expiry (MM/YY):</label>
            <input
              type="text"
              value={paymentDetails.expiry}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, expiry: e.target.value })
              }
            />
            {errors.expiry && <div className="error">{errors.expiry}</div>}
          </div>
          <div className="form-group">
            <label>CVV:</label>
            <input
              type="text"
              value={paymentDetails.cvv}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
              }
            />
            {errors.cvv && <div className="error">{errors.cvv}</div>}
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="section">
          <h2>Order Summary</h2>
          <div className="order-summary">
            {cartItems.map((item, index) => (
              <div className="item" key={index}>
                <div className="item-info">
                  <img
                    className="item-image"
                    src={item.image}
                    alt={item.name}
                  />
                  <span>{item.name}</span>
                </div>
                <span>{`$${item.price.toFixed(2)}`}</span>
              </div>
            ))}
            <div className="order-summary-total">
              <span>Subtotal:</span>
              <span>{`$${calculateSubtotal().toFixed(2)}`}</span>
            </div>
            <div className="order-summary-total">
              <span>Shipping:</span>
              <span>$10</span>
            </div>
            <div className="order-summary-total order-total">
              <span>Total:</span>
              <span>{`$${(calculateSubtotal() + 10).toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <div className="cancel-order">
          <button onClick={handleCancelOrder}>Cancel Order</button>
        </div>
        <div className="place-order">
          <button className="button place-order" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
