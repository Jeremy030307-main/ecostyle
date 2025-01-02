import React, { createContext, useState, useContext } from 'react';

// Create the WishlistContext
const WishlistContext = createContext();

// Custom hook to use the WishlistContext in components
export const useWishlist = () => useContext(WishlistContext);

// WishlistProvider to wrap around the app and provide wishlist state
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Function to add an item to the wishlist
  const addItemToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? 
          { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Function to remove an item from the wishlist
  const removeItemFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Function to update the quantity of an item in the cart
  const updateWishlistItemQuantity = (productId, newQuantity) => {
    setWishlistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) } // Prevent quantity from being less than 1
          : item
      )
    );
  };

  // Function to calculate subtotal
  const calculateWishlistSubtotal = () => {
    return wishlistItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  // Function to calculate total number of items in the cart
  const calculateWishlistTotalItems = () => {
    return wishlistItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        setWishlistItems,
        addItemToWishlist,
        removeItemFromWishlist,
        updateWishlistItemQuantity,
        calculateWishlistSubtotal,
        calculateWishlistTotalItems
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
