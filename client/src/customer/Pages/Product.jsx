import React, { useEffect,useState } from 'react';
import {useParams } from 'react-router-dom';
import { useCart } from '../../CartContext'; // Import the Cart Context
import { useWishlist } from '../../WishlistContext'; // Import Wishlist Context
import './Product.css'; // CSS file for styling
import { useProductReview } from '../../apiManager/methods/reviewMethods';
import { useProduct } from '../../apiManager/methods/productMethods';
import { addCartProduct } from '../../apiManager/methods/cartMethods';
import { RatingStar } from './RatingStart';



const Product = () => {

  const { productID } = useParams();
  const product = useProduct(productID);
  console.log(product)

  const { addItemToWishlist } = useWishlist(); // Access Wishlist functions

  const [reviews, setReviews] = useState([]); // State to store reviews
  const [loadingReviews, setLoadingReviews] = useState(true); // State to track loading

  const handleAddToWishlist = () => {
    addItemToWishlist({ ...product, quantity: 1 });
  };

  const [selectedVariant, setVariant] = useState(null)
  const [selectedSize, setSize] = useState("S")
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product) {
      setVariant(product.variant[0].id)
      setSize(product.size[0])
      setSelectedImage(product.thumbnail)
    }
  }, [product])

  // const fetchedReviews = useProductReview(product?.id)

  if (!product) {
    return <p>Product not found!</p>;
  }

  const handleAddToCart = async() => {
    try{
      await addCartProduct(productID, selectedVariant, selectedSize, 1);
    } catch (error) {
      console.log(error.message)
    }
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
          <div>
            <h1 className="product-name">{product.name}</h1>

            {product && product.rating && product.reviewCount ? (
              <div className='product-rating-reviewCount'>
                <RatingStar rating={product.rating}/>
                <p>{product.reviewCount} reviews</p>
              </div>
            ): (
              <p>This product has no reviews yet.</p>
            )}

            {/* Product Price */}
            <p className="product-price">${product.price.toFixed(2)}</p>
          </div>

          <div className='product-selection'>
            {/* Available Colors */}
            <h2>Available Colors</h2>
            <div className="product-colors">
              {product.variant && product.variant.length > 0 ? (
                product.variant.map((variant) => (
                  <div
                    key={variant.id}
                    className={`color-swatch ${
                      selectedVariant === variant.id ? "selected" : ""
                    }`}
                    style={{ backgroundColor: variant.colorCode }}
                    title={variant.name}
                    onClick={() => {
                      setSelectedImage(variant.image);
                      setVariant(variant.id)
                    }} // Update selected image on color click
                    
                  ></div>
                ))
              ) : (
                <p>No colors available</p>
              )}
            </div>
          </div>

          <div className='product-selection'>
            {/* Available Sizes */}
            <h2>Available Sizes</h2>
            <div className="product-sizes">
              {product.size && product.size.length > 0 ? (
                product.size.map((size, index) => (
                  <button key={index} 
                  className={`size-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSize(size)}>
                    {size}
                  </button>
                ))
              ) : (
                <p>No sizes available</p>
              )}
            </div>
          </div>

          {/* Add to Cart and Favorite Buttons */}
          <div className="action-buttons">
            <button className="fav-btn" onClick={handleAddToWishlist}>
              <i class="fa-regular fa-heart"></i>            
            </button>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-item">
              <p className="review-header">{review.user || 'Anonymous'}</p>
              <p className="review-details">
                Height: {review.height || 'N/A'} | Weight: {review.weight || 'N/A'}
              </p>
              <p className="review-text">{review.text || 'No review text'}</p>
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
