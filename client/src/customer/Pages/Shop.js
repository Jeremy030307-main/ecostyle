import React from 'react';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const isInWishlist = wishlist.includes(product.id);

    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button
                onClick={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)}
            >
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
        </div>
    );
};

export default ProductCard;