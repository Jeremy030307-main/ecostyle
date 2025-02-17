// src/pages/Cancellation.js
import React from "react";
import "./Account.css";
import { useLocation } from "react-router-dom";
import { FaCheck, FaArrowLeft } from 'react-icons/fa';

function convertDate(datetime) {
    // Convert seconds to milliseconds
    const date = new Date(datetime._seconds * 1000);

    // Format the date
    const formattedDate = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
    });

    return formattedDate
}

const StatusTimeline = ({orderID, orderStatus, total, order_placed, order_paid, order_ship_out, order_received, order_completed}) => {
    
    const steps = [
        {
          title: 'Order Placed',
          date: order_placed ? convertDate(order_placed) : null,
          completed: !!order_placed
        },
        {
          title: `Order Paid ${total? `(RM${total})` : ''}`,
          date: order_paid ? convertDate(order_paid) : null,
          completed: !!order_paid
        },
        {
          title: 'Order Shipped Out',
          date: order_ship_out ? convertDate(order_ship_out) : null,
          completed: !!order_ship_out
        },
        {
          title: 'Order Received',
          date: order_received ? convertDate(order_received) : null,
          completed: !!order_received
        },
        {
          title: 'Order Completed',
          date: order_completed ? convertDate(order_completed) : null,
          completed: !!order_completed
        }
      ];

    return (
      <div className="order-status-container">
        {/* Header Section */}
        <div className="order-status-header">
          <button className="order-back-button">
            <FaArrowLeft/> BACK
          </button>

          <div className="order-info">
            <span className="order-id">ORDER ID . {orderID}</span>|
            <span className="order-status">{orderStatus}</span>
          </div>
        </div>

        {/* Horizontal Timeline */}
      <div className="timeline-wrapper">
        <div className="timeline">
          {steps.map((step, index) => (
            <div key={index} className="timeline-item">
              {/* Progress Line */}
              {index !== 0 && <div className="timeline-progress" />}
              
              {/* Step Content */}
              <div className="step-content">
                <div className={`step-icon ${step.completed ? 'completed' : ''}`}>
                  {step.completed && <FaCheck className="check-icon" />}
                </div>
                <div className="step-dates">
                  <div className="step-date">{step.date}</div>
                  <div className="step-title">{step.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  
      </div>
    );
  };

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
        <StatusTimeline
        orderID={order.id.slice(3)}
        orderStatus={order.order_status}
        total={order.roundedTotal}
        order_placed={order.order_placed}
        order_paid={order.order_paid}
        order_ship_out={order.order_ship_out}
        order_completed={order.order_completed}
        order_received={order.order_received}
        />
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
                <span>RM {getSubtotal(product)}</span>
                </div>
            </div>
            ))}
            <div className="account-order-total"><p>Subtotal: </p> <p>RM {order.subtotal}</p></div>
            <div className="account-order-total"><p>Shipping Fee: </p>RM {order.shippingFee}</div>
            <div className="account-order-total"><p>Total: </p> <p style={{fontWeight: "bold", fontSize:"25px", color:"#17a375" }}>RM {order.roundedTotal}</p></div>
            <div className="account-order-total"><p>Payment Method: </p> {order.paymentType.charAt(0).toUpperCase() + order.paymentType.slice(1)}</div>
        </div>

    </div>

    </div>
  );
};

export default AccountOrderDetail;
