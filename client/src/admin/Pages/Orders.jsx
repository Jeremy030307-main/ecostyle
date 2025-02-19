import React, { useState } from "react";
import { currency } from "../admin";
import { assets } from "../Components/Assets/assets";
import { getAllOrders } from "../../apiManager/methods/orderMethod";
import "./Orders.css";

const Orders = () => {

  const [orderData, setOrderData] = useState([])

  useState(()=>{
    const fetchData = async() => {
      const data = await getAllOrders()
      setOrderData(data)
    }

    fetchData()
  })

  console.log(orderData)
  if (!orderData) {
    return <p>Loading...</p>;
  }

  return (
    <>
    {orderData && orderData.length>0 && <div>
      <h3>Order Page</h3>
      <div>
        {orderData && orderData.length>0 && orderData.map((order, index) => (
          <div className="orders-container" key={index}>
            <img className="order-image" src={assets.parcel_icon} alt="" />
            <div>
              <div className="order-items">
                {order.products && order.products.length>0 && order.products.map((product, index) => {
                  if (index === order.products.length - 1) {
                    return (
                      <p key={index}>
                        {product.name} x {product.quantity}{" "}
                        <span> {product.size} </span>
                      </p>
                    );
                  } else {
                    return (
                      <p key={index}>
                        {product.name} x {product.quantity}{" "}
                        <span> {product.size} </span>,{" "}
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
            <div className="order-info">
              <p className="sm">Items : {order.products.length}</p>
              <p className="mt-3">
                Method : {order.paymentType}
              </p>
              <p>Payment ID: {order.id}</p>
              {/* <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p> */}
            </div>

            <p className="sm">
              {currency}
              {order.subtotal}
            </p>
            <select value={order.status} className="order-select">
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out of Delivery">Out of Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>}
    
    </>
    
  );
};

export default Orders;
