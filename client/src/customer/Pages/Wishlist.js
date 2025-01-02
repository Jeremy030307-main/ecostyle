import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { products } from '../data/products'; // Replace with your product data source

const Wishlist = () => {
    const { wishlist } = useWishlist();
    const wishlistProducts = products.filter(product => wishlist.includes(product.id));

    return (
        <div>
            <h2>Your Wishlist</h2>
            <div className="wishlist-container">
                {wishlistProducts.length > 0 ? (
                    wishlistProducts.map(product => (
                        <div key={product.id} className="wishlist-item">
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>${product.price}</p>
                        </div>
                    ))
                ) : (
                    <p>Your wishlist is empty.</p>
                )}
            </div>
        </div>
    );
};

export default Wishlist;