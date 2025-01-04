import React, { useEffect, useState } from "react";
import { currency } from "../admin";
import { assets } from "../Components/Assets/assets";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div className="orders-container" key={index}>
            <img className="order-image" src={assets.parcel_icon} alt="" />
            <div>
              <div className="order-items">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (
                      <p key={index}>
                        {item.name} x {item.quantity} <span> {item.size} </span>
                      </p>
                    );
                  } else {
                    return (
                      <p key={index}>
                        {item.name} x {item.quantity} <span> {item.size} </span>
                        ,{" "}
                      </p>
                    );
                  }
                })}
              </div>

              <p className="order-address">
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

              <p>{order.address.phone}</p>
            </div>
            <div className="order-info">
              <p className="sm">Items : {order.items.length}</p>
              <p className="mt-3">Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className="sm">
              {currency}
              {order.amount}
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
