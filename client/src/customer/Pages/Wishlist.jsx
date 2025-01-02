import React, { useEffect } from 'react';
import { useWishlist } from '../../WishlistContext';
import ProductCard from '../Components/ProductCard'; // For rendering individual products

const Wishlist = () => {
  const { wishlist, fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist(); // Load wishlist items on mount
  }, []);

  return (
    <div>
      <h1>Your Wishlist</h1>
      {wishlist.length > 0 ? (
        <div className="wishlist-grid">
          {wishlist.map((productId) => (
            <ProductCard key={productId} productId={productId} />
          ))}
        </div>
      ) : (
        <p>Your wishlist is empty!</p>
      )}
    </div>
  );
};

export default Wishlist;