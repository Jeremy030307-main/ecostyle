// src/pages/Cancellation.js
import React, { useEffect, useState } from "react";
import { getUserOrder } from "../../apiManager/methods/orderMethod";
import "./Account.css";
import AccountOrderDetail from "./AccountOrderDetail";
import { useNavigate } from "react-router-dom";

const AccountOrderCard = ({ order, index }) => {
  const getSubtotal = (product) => {
    return product.price * product.quantity;
  };

  return (
    <div className="account-order-items" id={index}>
      <div
        className="account-order-card-header"
        style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
      >
        <strong>
          <span className="account-order-label">Order ID: </span>
        </strong>
        <strong>
          <span className="account-order-value">{order.id}</span>
        </strong>
      </div>

      {/* Display only the first product */}
      {order.products.slice(0, 1).map((product, productIndex) => (
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
          <div className="account-order-item-quantity">x {product.quantity}</div>
          <div className="account-order-item-subtotal">
            <span>Subtotal: ${getSubtotal(product)}</span>
          </div>
        </div>
      ))}

      {/* Display "X more items" if there are additional products */}
      {order.products.length > 1 && (
        <div className="account-order-more-items">
          <span>{order.products.length - 1} more items</span>
        </div>
      )}

      <div className="account-order-total">Total: ${order.total}</div>
    </div>
  );
};

const AccountOrder = () => {
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate()

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

  return (
    <div className='payment-option-container'>

      <div className='payment-option-header'>
        < h1>My Orders</h1>
        
      </div>

      <div className="account-order-container">
      {orderData.map((order, index) => (
        <>
        {/* <AccountOrderDetail order={order} index={index}/> */}
        <div onClick={() =>navigate(`./${order.id}`, { state: {order} })}>
          <AccountOrderCard order={order} index={index}/>
        </div>
        </>
      ))}
    </div>

    </div>
  );
};

export default AccountOrder;
