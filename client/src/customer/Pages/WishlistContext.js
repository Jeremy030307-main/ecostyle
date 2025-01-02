import React, { createContext, useState, useContext } from 'react';
import { getFirestore, doc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const db = getFirestore();
    const auth = getAuth();

    // Fetch Wishlist from Firestore
    const fetchWishlist = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const wishlistRef = collection(db, 'user', user.uid, 'wishlist');
                const querySnapshot = await getDocs(wishlistRef);
                const wishlistItems = querySnapshot.docs.map((doc) => doc.id); // Use document ID as product ID
                setWishlist(wishlistItems);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    // Add Product to Wishlist
    const addToWishlist = async (productId) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const wishlistRef = collection(db, 'user', user.uid, 'wishlist');
                await addDoc(wishlistRef, { productId }); // Add product ID to Firestore
                setWishlist((prev) => [...prev, productId]); // Update local state
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    // Remove Product from Wishlist
    const removeFromWishlist = async (productId) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const wishlistRef = collection(db, 'user', user.uid, 'wishlist');
                const querySnapshot = await getDocs(wishlistRef);
                const docToDelete = querySnapshot.docs.find((doc) => doc.data().productId === productId);
                if (docToDelete) {
                    await deleteDoc(doc(db, 'user', user.uid, 'wishlist', docToDelete.id)); // Delete the document
                    setWishlist((prev) => prev.filter((id) => id !== productId)); // Update local state
                }
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);