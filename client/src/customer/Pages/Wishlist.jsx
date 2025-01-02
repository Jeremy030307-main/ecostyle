import React from 'react';
import { useWishlist } from '../../WishlistContext';
import { useCart } from '../../CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeItemFromWishlist } = useWishlist();
  const { addItemToCart } = useCart();

  const moveToCart = (item) => {
    addItemToCart(item); // Add the item to the cart
    removeItemFromWishlist(item.id); // Remove it from the wishlist
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <img src={item.image} alt={item.name} className="wishlist-item-image" />
              <div className="wishlist-item-details">
                <h2>{item.name}</h2>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className="wishlist-item-actions">
                <button
                  className="move-to-cart-btn"
                  onClick={() => moveToCart(item)}
                >
                  Move to Cart
                </button>
                <button
                  className="remove-item-btn"
                  onClick={() => removeItemFromWishlist(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
