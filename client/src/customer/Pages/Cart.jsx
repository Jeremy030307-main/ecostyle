import React, { useEffect, useState } from 'react';
import { useCart } from '../../CartContext.js';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { deleteCartProduct, updateCartProduct, useUserCart } from '../../apiManager/methods/cartMethods.js';

const Cart = () => {

  const cartItems = useUserCart();
  // const {cartItems} = useCart
  const navigate = useNavigate();

  const [totalItem, setTotalItem] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // Calculate total items and total amount
      const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      setTotalItem(totalQuantity);
      setTotalAmount(totalPrice);
    } else {
      setTotalItem(0);
      setTotalAmount(0);
    }
    console.log(cartItems)
  }, [cartItems]);

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the Checkout page
  };

  const updateItemQuantity = async(cartProductID, quantity) => {
    try {
      await updateCartProduct(cartProductID, quantity);
    } catch (error) {
      console.log(error.message)
    }
  }

  const deleteCartItem = async (cartProductID) => {
    try {
      await deleteCartProduct(cartProductID);
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="cart-container">
      <div className="breadcrumbs">
        <span>Home</span> / <span>Cart</span>
      </div>
      <h1 className="cart-title">Your Cart</h1>
      {cartItems && cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems && cartItems.map((item, index) => (
              <div key={item.id}>
                <div className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.name}</h2>
                    <p className="cart-item-id">
                      #{item.product} / {item.color} / {item.size}
                    </p>
                  </div>
                  <div className="cart-item-price-details">
                    <p className="cart-item-price">${item.price}</p>
                    <div className="cart-item-quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="cart-item-quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="remove-item-btn"
                      onClick={() => deleteCartItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {/* {index < cartItems.length - 1 && <hr className="divider" />} */}
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="cart-order-summary">
            <h2>Order Summary</h2>
            {/* Update this line to show total quantity */}
            <p>{totalItem} items subtotal</p>
            <div className="cart-order-total">
              <h3>Order Total</h3>
              <p>${totalAmount}</p>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
