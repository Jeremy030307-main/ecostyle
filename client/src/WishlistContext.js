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
    if (!wishlistItems.find((item) => item.id === product.id)) {
      setWishlistItems((prevItems) => [...prevItems, product]);
    }
  };

  // Function to remove an item from the wishlist
  const removeItemFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Function to check if an item is in the wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addItemToWishlist,
        removeItemFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
