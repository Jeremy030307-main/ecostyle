import React, { useEffect, useState } from "react";
import { currency } from "../admin";
import { assets } from "../Components/Assets/assets";
import { useOrder } from "../../apiManager/methods/orderMethod";
import './Orders.css'

const Orders = () => {

  const orderData = useOrder();
  if (!orderData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orderData.map((order, index) => (
          <div className="orders-container" key={index}>
            <img className="order-image" src={assets.parcel_icon} alt="" />
            <div>
              <div className="order-items">
                {order.products.map((product, index) => {
                  if (index === order.products.length - 1) {
                    return (
                      <p key={index}>
                        {product.name} x {product.quantity} <span> {product.size} </span>
                      </p>
                    );
                  } else {
                    return (
                      <p key={index}>
                        {product.name} x {product.quantity} <span> {product.size} </span>
                        ,{" "}
                      </p>
                    );
                  }
                })}
              </div>
                
                {/* Can be used for future(Change the order data structure) */}
              {/* <p className="order-address">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    "," +
                    order.address.state +
                    " ," +
                    order.address.country +
                    " ," +
                    order.address.zipcode}
                </p>
              </div>

              <p>{order.address.phone}</p> */}

              <p className="order-address">{order.shippingAddress}</p>

            </div>
            <div className="order-info">
              <p className="sm">Items : {order.products.length}</p>
              <p className="mt-3">Method : {order.paymentDetails.paymentMethod.join(", ")}</p>
              <p>Payment ID: {order.paymentDetails.paymentID}</p>
              {/* <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p> */}
            </div>

            <p className="sm">
              {currency}
              {order.total}
            </p>
            <select className="order-select">
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out of Delivery">Out of Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
