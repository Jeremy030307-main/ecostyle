import { useContext, useEffect, useState } from "react";
import "./Checkout.css"
import { CheckoutContext } from "./CheckoutWrapper";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../../apiManager/methods/paymentMethod";

// OrderSummaryLine component: Accepts productID and quantity as props
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

const OrderSummaryTotal = ({subtotal, shippingFee}) => {

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
        <p>RM{subtotal + shippingFee}</p>
      </div>
    </div>
  )
}

const OrderSummary = ({address}) => {

  const {userCart, total} = useContext(CheckoutContext)
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  // Check if userCart is null or undefined before rendering
  if (userCart === null || userCart === undefined) { 
    return <p>Loading...</p>; // Render loading state while the cart is fetching
  }

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      console.error("Stripe or Elements not properly initialized.");
      return;
    }
  
    // Prepare the shipping address data
    const addressData = {
      name: address.name,
      address: {
        line1: address.line1,
        line2: address.line2 || null,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
      },
      phone: address.phone || null,
    };
  
    setIsLoading(true);
  
    // Use the payment element (UI embedded flow)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout/complete",
        shipping: addressData,
      },
    });

    if (error) {
      console.error("Payment confirmation error:", error.message);
      setMessage(error.message);
      setIsLoading(false);
    } else {
      // Stripe will handle the redirection automatically
      console.log("Payment successful with PaymentElement!");
    }
  
    setIsLoading(false);
  };

  return (
    <div className="order-summary">
      <h2 className="summary-header">
        Order Summary
      </h2>

      <div className="summary-details">
        {userCart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          userCart.map((cartLine, index) => (
            <OrderSummaryLine
              key={index}
              productData={cartLine} // Assuming cartLine has product details
              quantity={cartLine.quantity} // Assuming cartLine has quantity
            />
          ))
        )}
      </div>

      <OrderSummaryTotal 
        subtotal = {total}
        shippingFee={0}/>

      <button className='checkout-place-order-btn' disabled={isLoading || !stripe || !elements || !address } id="submit" onClick={() => handleSubmit()}>
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </div>
  );
};

export default OrderSummary;

