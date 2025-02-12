// src/pages/Cancellation.js
import React, { useEffect, useState } from "react";
import { getUserOrder } from "../../apiManager/methods/orderMethod";
import "./Account.css";
import { useLocation } from "react-router-dom";

const AccountOrderDetail = () => {

    const location = useLocation();
    const order = location.state?.order; // Access the passed state

  // Calculate subtotal for each product
  const getSubtotal = (product) => {
    return product.price * product.quantity;
  };

  return (

    <div className='payment-option-container'>

      <div className='payment-option-header'>
        < h1>My Orders</h1> 
      </div>

      <div className="account-order-wrapper" >
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <span className="account-order-value" style={{ marginRight: "8px" , marginTop: "5px"}}>**** **** ****</span>
                <span className="account-order-value">{order.paymentDetails.cardLast4}</span>
            </div>
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

        {/* Delivery Information */}
        <div className="account-order-delivery">
            <h2>Delivery Information</h2>
            <div className="account-order-delivery-details">
            {order.shippingAddress && (
                <>
                <p>
                    <strong>Name:</strong> {order.shippingAddress.name}
                </p>
                <p>
                    <strong>Phone:</strong> {order.shippingAddress.phone}
                </p>
                <p>
                    <strong>Address:</strong>{" "}
                    {`${order.shippingAddress.address.line1}, ${
                    order.shippingAddress.address.line2 || ""
                    }, ${order.shippingAddress.address.city}, ${
                    order.shippingAddress.address.state
                    } ${order.shippingAddress.address.postal_code}, ${
                    order.shippingAddress.address.country
                    }`}
                </p>
                {order.shippingAddress.carrier && (
                    <p>
                    <strong>Carrier:</strong> {order.shippingAddress.carrier}
                    </p>
                )}
                {order.shippingAddress.tracking_number && (
                    <p>
                    <strong>Tracking Number:</strong>{" "}
                    {order.shippingAddress.tracking_number}
                    </p>
                )}
                </>
            )}
            </div>
        </div>
    </div>

    </div>
  );
};

export default AccountOrderDetail;
