import { useEffect, useState } from "react";
import "./Checkout.css"
import { useCart } from "../../apiManager/methods/cartMethods";
import { useProduct } from "../../apiManager/methods/productMethods";

// OrderSummaryLine component: Accepts productID and quantity as props
const OrderSummaryLine = ({productData, quantity}) => {

  return (
    <div className="order-summary-line">
      
      <img 
        src={productData.image} 
        alt={productData.name} 
        className="product-image" 
      />

      <div className="summary-line-detail">
        <div>
          <h4 style={{ margin: "0", padding: "0" }}>{productData.name}</h4>
          <p style={{ margin: "0", padding: "0" }}  className="summary-product-code">Item: #{productData.product}/ {productData.variant}/ {productData.size}</p>
        </div>

        <div className="price-quantity">
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

      <div className="summary-total final_amount" style={{fontSize: "larger"}}>
        <p>Total</p>
        <p>RM{subtotal + shippingFee}</p>
      </div>
    </div>
  )
}

const OrderSummary = () => {
  const userCart = useCart();

  console.log(userCart)

  // Check if userCart is null or undefined before rendering
  if (userCart === null || userCart === undefined) { 
    return <p>Loading...</p>; // Render loading state while the cart is fetching
  }

  // Calculate the total price
  const total = userCart.reduce((accumulatedTotal, cartLine) => {
    // Multiply price of product with quantity and add to the accumulated total
    return accumulatedTotal + (cartLine.price * cartLine.quantity);
  }, 0);

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
    </div>
  );
};

export default OrderSummary;

