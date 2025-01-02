import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Fetch Wishlist
  const fetchWishlist = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const wishlistRef = collection(db, 'user', user.uid, 'wishlist');
        const querySnapshot = await getDocs(wishlistRef);
        const wishlistItems = querySnapshot.docs.map((doc) => doc.data().productId);
        setWishlist(wishlistItems);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Add to Wishlist
  const addToWishlist = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const wishlistRef = collection(db, 'user', user.uid, 'wishlist');
        await addDoc(wishlistRef, { productId });
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const wishlistRef = collection(db, 'user', user.uid, 'wishlist');
        const querySnapshot = await getDocs(wishlistRef);
        const docToDelete = querySnapshot.docs.find((doc) => doc.data().productId === productId);
        if (docToDelete) {
          await deleteDoc(docToDelete.ref);
          setWishlist((prev) => prev.filter((id) => id !== productId));
        }
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Ensure Wishlist Fetch on User Login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchWishlist();
      } else {
        setWishlist([]); // Clear wishlist if no user is logged in
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);