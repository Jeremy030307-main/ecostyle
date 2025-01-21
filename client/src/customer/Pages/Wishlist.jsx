import React from 'react';
import { useWishlist } from '../../WishlistContext';
import { useCart } from '../../CartContext';
import './Wishlist.css';
import ProductCard from '../Components/ProductCard';

const Wishlist = () => {
  const {  wishlistItems, wishlistTotalItems } = useWishlist();

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="shop-productCard-grid">
          {wishlistItems && wishlistItems.map((product) => (
            <ProductCard productData={product}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
