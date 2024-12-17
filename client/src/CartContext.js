import React, { createContext, useState, useContext } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the CartContext in components
export const useCart = () => useContext(CartContext);

// CartProvider to wrap around the app and provide cart state
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add an item to the cart
  const addItemToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? 
          { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Function to remove an item from the cart
  const removeItemFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  };

  // Function to calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, calculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};
