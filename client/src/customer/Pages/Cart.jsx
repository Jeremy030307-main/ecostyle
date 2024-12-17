import React from 'react';
import { useCart } from '../../CartContext.js';

const Cart = () => {
  const { cartItems, removeItemFromCart } = useCart();

  // Calculate total price of all items in the cart
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h2 className="cart-item-name">{item.name}</h2>
                  <p className="cart-item-id">#{item.id} / {item.color} / {item.size}</p>
                </div>
                <div className="cart-item-price-details">
                  <p className="cart-item-price">${item.price}</p>
                  <div className="cart-item-quantity">
                    <span>x {item.quantity}</span>
                  </div>
                  <p className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItemFromCart(item)} className="remove-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <p>{cartItems.length} items subtotal</p>
            <div className="order-total">
              <h3>Order Total</h3>
              <p>${totalPrice}</p>
            </div>
            <button className="checkout-btn">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
