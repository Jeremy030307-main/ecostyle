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
    tag: '', // Custom tag for new address
  });
  const [savedAddresses, setSavedAddresses] = useState([]); // List of saved addresses
  const [errors, setErrors] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [selectedTag, setSelectedTag] = useState(''); // Selected tag to filter saved addresses
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'new'

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

  // Handle selecting address from dropdown in saved addresses tab
  const handleAddressSelection = (e) => {
    setSelectedTag(e.target.value);
  };

  // Filter saved addresses based on selected tag
  const filteredAddress = savedAddresses.find(
    (address) => address.tag === selectedTag
  );

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

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={activeTab === 'saved' ? 'active' : ''}
          onClick={() => setActiveTab('saved')}
        >
          Saved Addresses
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
          <h2>Shipping Address</h2>

          {/* Tab Content for Saved Addresses */}
          {activeTab === 'saved' && savedAddresses.length > 0 && (
            <div className="saved-addresses">
              {/* Dropdown for selecting address by tag */}
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
                      placeholder={
                        key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
                      }
                      value={value}
                      onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                    />
                    {errors[key] && <span className="error">{errors[key]}</span>}
                  </div>
                )
              ))}

              <div className="form-field">
                <input
                  type="text"
                  placeholder="Custom Tag (e.g., My Home, Parents' Home)"
                  value={newAddress.tag}
                  onChange={(e) => setNewAddress({ ...newAddress, tag: e.target.value })}
                />
                {errors.tag && <span className="error">{errors.tag}</span>}
              </div>

              <button className="continue-btn" onClick={handleAddAddress}>
                Save Address
              </button>
            </div>
          )}

          {/* Continue to Payment Button */}
          <button
            className="continue-btn"
            onClick={() => setStep('payment')}
            disabled={!selectedTag && activeTab === 'saved'}
          >
            Continue to Payment
          </button>
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
