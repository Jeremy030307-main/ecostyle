import { useEffect, useState } from "react";
import "./Checkout.css"
import { useCart } from "../../apiManager/methods/cartMethods";
import { useProduct } from "../../apiManager/methods/productMethods";

// OrderSummaryLine component: Accepts productID and quantity as props
const OrderSummaryLine = ({productData, quantity}) => {

  return (
    <div className="order-summary-line">
      <h4>{productData.name}</h4>
      <p>Quantity: {quantity}</p>
      <p>Price: ${productData.price}</p>
      <p>Total: ${productData.price * quantity}</p>
    </div>
  );
};

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
    return accumulatedTotal + (cartLine.productDetails.price * cartLine.quantity);
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
              productData={cartLine.productDetails} // Assuming cartLine has product details
              quantity={cartLine.quantity} // Assuming cartLine has quantity
            />
          ))
        )}
      </div>

      {/* Display the total */}
      <div className="order-total">
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default OrderSummary;

