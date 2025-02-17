import React, { useContext, useEffect, useState } from "react";
import {
  useStripe,
} from "@stripe/react-stripe-js";
import { CheckoutContext } from './CheckoutWrapper';
import {  payOrder } from "../../apiManager/methods/orderMethod";
import checkoutCompleteStockImage from "../Components/Assets/checkout-complete-image.svg"
import logo_text_image from "../Components/Assets/logo_text.png"
import { useNavigate } from "react-router-dom";

const SuccessIcon =
  <svg width="20" height="16" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z" fill="white"/>
  </svg>;

const ErrorIcon =
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z" fill="white"/>
  </svg>;

const InfoIcon =
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M10 1.5H4C2.61929 1.5 1.5 2.61929 1.5 4V10C1.5 11.3807 2.61929 12.5 4 12.5H10C11.3807 12.5 12.5 11.3807 12.5 10V4C12.5 2.61929 11.3807 1.5 10 1.5ZM4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H10C12.2091 14 14 12.2091 14 10V4C14 1.79086 12.2091 0 10 0H4Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M5.25 7C5.25 6.58579 5.58579 6.25 6 6.25H7.25C7.66421 6.25 8 6.58579 8 7V10.5C8 10.9142 7.66421 11.25 7.25 11.25C6.83579 11.25 6.5 10.9142 6.5 10.5V7.75H6C5.58579 7.75 5.25 7.41421 5.25 7Z" fill="white"/>
    <path d="M5.75 4C5.75 3.31075 6.31075 2.75 7 2.75C7.68925 2.75 8.25 3.31075 8.25 4C8.25 4.68925 7.68925 5.25 7 5.25C6.31075 5.25 5.75 4.68925 5.75 4Z" fill="white"/>
  </svg>;

const STATUS_CONTENT_MAP = {
  succeeded: {
    text: "Thank you for your purchases",
    iconColor: "#30B130",
    icon: SuccessIcon,
  },
  processing: {
    text: "Your payment is processing.",
    iconColor: "#6D6E78",
    icon: InfoIcon,
  },
  requires_payment_method: {
    text: "Your payment was not successful, please try again.",
    iconColor: "#DF1B41",
    icon: ErrorIcon,
  },
  default: {
    text: "Something went wrong, please try again.",
    iconColor: "#DF1B41",
    icon: ErrorIcon,
  }
};

const OrderSummaryLine = ({productData, quantity}) => {

  return (
    <div className="order-summary-line">
      
      <img 
        src={productData.image} 
        alt={productData.name} 
        className="summary-product-image" 
      />

      <div className="summary-line-detail">
        <div>
          <h4 style={{ margin: "0", padding: "0" }}>{productData.name}</h4>
          <p style={{ margin: "0", padding: "0" }}  className="summary-product-code">Item: #{productData.product}/ {productData.variant}/ {productData.size}</p>
        </div>

        <div className="summary-price-quantity ">
          <p>RM{productData.price}</p>
          <p>× {quantity}</p>
        </div>
      </div>

      <div className="summary-line-total">
        <p>RM{productData.price * quantity}</p>
      </div>
    </div>
  );
};

const OrderSummaryTotal = ({total, subtotal, shippingFee}) => {

  return (
    <div className="summary-total-container">
      <div className="summary-total">
        <p>Subtotal</p>
        <p>RM{subtotal}</p>
      </div>

      <div className="summary-total">
        <p>Shipping</p>
        <p>RM{shippingFee}</p>
      </div>

      <hr />

      <div className="summary-total summary-final_amount" style={{fontSize: "larger"}}>
        <p>Total</p>
        <p>RM{total}</p>
      </div>
    </div>
  )
}

export default function CheckoutComplete() {

  const stripe = useStripe();
  const navigate = useNavigate()

  const [status, setStatus] = useState("default");
  const [intentId, setIntentId] = useState(null);
  const [order, setOrder] = useState(null)

  useEffect(() => {

    const paidOrder = async(paymentIntentID) => {

      try{
        const orderData = await payOrder(paymentIntentID)
        setOrder(orderData.order)
      } catch (error) {
        console.log(error.message)
      }
    }

    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
      if (!paymentIntent) {
        return;
      }

      if (paymentIntent.status === "succeeded"){

        paidOrder(paymentIntent.id)
        console.log("Order Created")
      }

      setStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
    });
  }, [stripe]);

  useEffect(() => {
    console.log(order)
  }, [order])

  return (
    <div className="checkout-complete-container">

      <img src={checkoutCompleteStockImage} alt="" className="checkout-complete-image"/>

      { intentId && order && <div className="checkout-compelte-detail">

        <img src={logo_text_image} alt=""/>
        
        <div id="payment-status">

          <div id="status-icon" style={{backgroundColor: STATUS_CONTENT_MAP[status].iconColor}}>
            {STATUS_CONTENT_MAP[status].icon}
          </div>

          <h2 id="status-text">{STATUS_CONTENT_MAP[status].text}</h2>

          <div className="order-summary" style={{width: "80%"}}>
            <p style={{fontWeight:"bolder", fontSize: "20px"}} className="summary-header">
            Order Summary <br />
              <span style={{fontWeight: "lighter", fontSize: "15px"}}>#{intentId.slice(3)}</span>

              <div style={{paddingTop: "10px", display: "flex", justifyContent: "space-between"}}>
                <p>Delivery Information: </p>
                <div style={{fontWeight: "lighter", fontSize: "15px"}}>
                  <span>{order.shippingAddress.name}</span><br />
                  <span>{order.shippingAddress.address.line1}</span><br />
                  <span>{order.shippingAddress.address.line2}</span><br />
                  <span>{order.shippingAddress.address.postal_code}, {order.shippingAddress.address.city}, </span>
                  <span>{order.shippingAddress.address.state}</span><br />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>

            </p>

            <div className="summary-details">
              {order === null ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                {order.products.slice(0, 1).map((cartLine, index) => (
                  <OrderSummaryLine
                    key={index}
                    productData={cartLine} // Assuming cartLine has product details
                    quantity={cartLine.quantity} // Assuming cartLine has quantity
                  />
                ))}

                {/* Show a line if there are more than 2 items */}
                {order.products.length > 1 && (
                  <div style={{ marginTop: "10px", fontStyle: "italic", color: "#666", justifyContent: "right", display: "flex"}}>
                    +{order.products.length - 1} more items...
                  </div>
                )}

                <OrderSummaryTotal
                total={order.roundedTotal}
                subtotal={order.subtotal}
                shippingFee={order.shippingFee}
                />

                </>

              )}
            </div> 


          </div>

          <div className="checkout-complete-button">
            <button onClick={()=> {navigate("/..")}}>Back to Home</button>
            <button style={{backgroundColor: "black"}} onClick={()=> {navigate("/../account/order")}}>Order Details</button>
          </div>


        </div>
      </div>}

    </div>

  );
}