import React, { createContext, useState, useContext, useEffect } from 'react';
import { addwishlistProduct, deleteWishlsitProduct, getUserWishlist } from './apiManager/methods/wishlistMethod';

// Create the WishlistContext
const WishlistContext = createContext();

// Custom hook to use the WishlistContext in components
export const useWishlist = () => useContext(WishlistContext);

// WishlistProvider to wrap around the app and provide wishlist state
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistTotalItems, setWishlistTotalItems] = useState(0)

  const fetchWishlst = async() => {
     try {
      const data = await getUserWishlist();
      setWishlistItems(data)
    } catch (error) {
      console.log(error.message)
    }
   }

   useEffect(() => {
    fetchWishlst();
   }, [])

   useEffect(() => {
    setWishlistTotalItems(wishlistItems?.length || 0)

   }, [wishlistItems])

  // Function to add an item to the wishlist
  const addItemToWishlist = async(product) => {
    try{
      await addwishlistProduct(product);
      fetchWishlst()
    } catch (error) {
      console.log(error.message)
    }
  };

  // Function to remove an item from the wishlist
  const removeItemFromWishlist = async (product) => {
    try {
      await deleteWishlsitProduct(product);
      fetchWishlst()
    } catch (error) {
      console.log(error.message)
    }
  };

  const preesntInWishlist = (productID) => {
    return wishlistItems.some(item => item.id === productID);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistTotalItems,
        addItemToWishlist,
        removeItemFromWishlist,
        preesntInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
