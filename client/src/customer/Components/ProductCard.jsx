import React from 'react';
import { useWishlist } from '../../WishlistContext';

const ProductCard = ({ productId }) => {
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const isInWishlist = wishlist.includes(productId);

    return (
        <div className="product-card">
            <h3>Product {productId}</h3>
            <button
                onClick={() =>
                    isInWishlist ? removeFromWishlist(productId) : addToWishlist(productId)
                }
            >
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
        </div>
    );
};

export default ProductCard;