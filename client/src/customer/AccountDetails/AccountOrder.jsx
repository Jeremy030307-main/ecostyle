// src/pages/Cancellation.js
import React, { useEffect, useState } from "react";
import { getUserOrder } from "../../apiManager/methods/orderMethod";
import "./Account.css";

const AccountOrder = () => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchUserOrder = async () => {
      try {
        const data = await getUserOrder();
        console.log(data);
        setOrderData(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUserOrder();
  }, []);

  if (!orderData) {
    return <p>Loading...</p>;
  }

  // Calculate subtotal for each product
  const getSubtotal = (product) => {
    return product.price * product.quantity;
  };

  return (
    <div className="account-order-container">
      {orderData.map((order, index) => (
        <div key={index} className="account-order-wrapper">
          {/* Order Header */}
          <div className="account-order-header">
            <div className="account-order-detail">
              <strong>
                <span className="account-order-label">Order ID</span>
              </strong>
              <strong>
                <span className="account-order-value">{order.id}</span>
              </strong>
            </div>
            <div className="account-order-detail">
              <strong>
                <span className="account-order-label">Paid by</span>
              </strong>
              <span className="account-order-value">
                {order.paymentDetails.paymentMethod.join(", ")}
              </span>
            </div>
            <div className="account-order-detail">
              <span className="account-order-label">Customer ID</span>
              <span className="account-order-value">{order.customerID}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="account-order-items">
            {order.products.map((product, productIndex) => (
              <div key={productIndex} className="account-order-item">
                <div className="account-order-item-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="account-order-item-details">
                  <h3>{product.name}</h3>
                  <span className="account-order-price">${product.price}</span>
                  <div className="account-order-item-meta">
                    <span>Size: {product.size}</span>
                    <span>Variant: {product.variant}</span>
                    <span>Product ID: {product.product}</span>
                  </div>
                </div>
                <div className="account-order-item-quantity">
                  x {product.quantity}
                </div>
                <div className="account-order-item-subtotal">
                  <span>Subtotal: ${getSubtotal(product)}</span>
                </div>
              </div>
            ))}
            <div className="account-order-total">Total: ${order.total}</div>
          </div>

          {/* Shipping Information */}
          <div className="account-order-shipping">
            <h2>Shipping Information</h2>
            <div className="account-order-shipping-status">
              <div className="account-order-status-icon">📦</div>
              <span className="account-order-status-text">
                Your parcel has departed from sorting facility
              </span>
              <span className="account-order-status-arrow"></span>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="account-order-delivery">
            <h2>Delivery Information</h2>
            <div className="account-order-delivery-details">
              <p className="account-order-address">{order.shippingAddress}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountOrder;
