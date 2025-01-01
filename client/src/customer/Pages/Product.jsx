import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../CartContext'; // Import the Cart Context
import { useWishlist } from '../../WishlistContext'; // Import Wishlist Context
import './Product.css'; // CSS file for styling

const Product = () => {
  const location = useLocation();
  const { addItemToWishlist } = useWishlist(); // Access Wishlist functions
  const { addItemToCart } = useCart(); // Import the addItemToCart function from CartContext
  const product = location.state?.product;

  const handleAddToWishlist = () => {
    addItemToWishlist({ ...product, quantity: 1 });
  };

  // State to track the selected variant's image
  const [selectedImage, setSelectedImage] = useState(
    product?.variant[0]?.image || '/placeholder.png'
  );

  if (!product) {
    return <p>Product not found!</p>;
  }

  const handleAddToCart = () => {
    // Add the product to the cart with a default quantity of 1
    addItemToCart({ ...product, quantity: 1 });
  };

  return (
    <div className="product-page-container">
      <div className="product-main-content">
        {/* Left Section: Main Product Image */}
        <div className="product-image-section">
          <img
            src={selectedImage}
            alt={product.name}
            className="main-product-image"
          />
        </div>

        {/* Right Section: Product Details */}
        <div className="product-details-section">
          {/* Product Name */}
          <h1 className="product-name">{product.name}</h1>

          {/* Product Price */}
          <p className="product-price">${product.price.toFixed(2)}</p>

          {/* Available Sizes */}
          <h2>Available Sizes</h2>
          <div className="product-sizes">
            {product.size && product.size.length > 0 ? (
              product.size.map((size, index) => (
                <button key={index} className="size-button">
                  {size}
                </button>
              ))
            ) : (
              <p>No sizes available</p>
            )}
          </div>

          {/* Available Colors */}
          <h2>Available Colors</h2>
          <div className="product-colors">
            {product.variant && product.variant.length > 0 ? (
              product.variant.map((variant) => (
                <div
                  key={variant.id}
                  className="color-swatch"
                  style={{ backgroundColor: variant.colorCode }}
                  title={variant.name}
                  onClick={() => setSelectedImage(variant.image)} // Update selected image on color click
                ></div>
              ))
            ) : (
              <p>No colors available</p>
            )}
          </div>

          {/* Variants Section */}
          <h2>Variants</h2>
          <div className="product-variants">
            {product.variant.map((variant) => (
              <div
                key={variant.id}
                className="variant-item"
                onClick={() => setSelectedImage(variant.image)} // Update selected image on variant click
              >
                <img
                  src={variant.image}
                  alt={variant.name}
                  className="variant-image"
                />
                <p>{variant.name}</p>
              </div>
            ))}
          </div>

          {/* Add to Cart and Favorite Buttons */}
          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="fav-btn" onClick={handleAddToWishlist}>
            ❤️
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="review-item">
              <p className="review-header">{review.user}</p>
              <p className="review-details">
                Height: {review.height} | Weight: {review.weight}
              </p>
              <p className="review-text">{review.text}</p>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>
    </div>
  );
};

export default Product;
