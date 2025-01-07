import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../CartContext"; // Import the Cart Context
import { useWishlist } from "../../WishlistContext"; // Import Wishlist Context
import "./Product.css"; // CSS file for styling
import {
  getProductReview,
  getUserReview,
} from "../../apiManager/methods/reviewMethods";
import { useProduct } from "../../apiManager/methods/productMethods";
import { addCartProduct } from "../../apiManager/methods/cartMethods";
import { RatingStar, SmallRatingStar } from "./RatingStart";
import ReviewModal from "../Components/Review Modal/ReviewModal";

const ReviewCard = ({ review }) => {
  return (
    <div className="product-review-card" id={review.id}>
      <div className="product-review-user-circle">
        <h3>{
          review.user ? (review.user[0]) : (<></>)
        }</h3>
      </div>

      <div className="product-review-card-main-content">
        <div className="product-review-user-rating-container">
          <p>{review.user}</p>
          <SmallRatingStar rating={review.rating} />
        </div>

        <p>{review.comment}</p>
      </div>
    </div>
  );
};

const Product = () => {
  const { productID } = useParams();
  const product = useProduct(productID);
  const { addItemToWishlist } = useWishlist(); // Access Wishlist functions

  const handleAddToWishlist = () => {
    addItemToWishlist({ ...product, quantity: 1 });
  };

  const [selectedVariant, setVariant] = useState(null);
  const [selectedSize, setSize] = useState("S");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (product) {
      setVariant(product.variant[0].id);
      setSize(product.size[0]);
      setSelectedImage(product.thumbnail);
    }
  }, [product]);

  const [reviews, setReview] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReviewSubmitted =async () =>{
    try {
      const data = await getProductReview(productID);
      console.log(data);
      setReview(data);
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await getProductReview(productID);
        console.log(data);
        setReview(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchReview();
  }, [productID]);

  if (!product) {
    return <p>Product not found!</p>;
  }

  const handleAddToCart = async () => {
    try {
      await addCartProduct(productID, selectedVariant, selectedSize, 1);
    } catch (error) {
      console.log(error.message);
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
              <div className="product-rating-reviewCount">
                <RatingStar rating={product.rating} />
                <p>({product.reviewCount})</p>
              </div>
            ) : (
              <p>This product has no reviews yet.</p>
            )}

            {/* Product Price */}
            <p className="product-price">${product.price.toFixed(2)}</p>
          </div>

          <div className="product-selection">
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
                      setVariant(variant.id);
                    }} // Update selected image on color click
                  ></div>
                ))
              ) : (
                <p>No colors available</p>
              )}
            </div>
          </div>

          <div className="product-selection">
            {/* Available Sizes */}
            <h2>Available Sizes</h2>
            <div className="product-sizes">
              {product.size && product.size.length > 0 ? (
                product.size.map((size, index) => (
                  <button
                    key={index}
                    className={`size-button ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSize(size)}
                  >
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
        <div className="product-review-section-header">
          <h1>Reviews</h1>
          {product && product.rating && product.reviewCount ? (
            <div className="product-rating-reviewCount">
              <RatingStar rating={product.rating} />
              <p>({product.reviewCount})</p>
            </div>
          ) : (
            <p>This product has no reviews yet.</p>
          )}

          <div className="add-review-container">
            <button
              onClick={() => setIsModalOpen(true)}
              className="add-review-button"
            >
              Add a review
            </button>
          </div>

          <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            productID={product?.id}
            onSubmitSuccess={handleReviewSubmitted}
          />
        </div>

        {reviews ? (
          reviews.length > 0 ? (
            reviews.map((review, index) => <ReviewCard review={review} />)
          ) : (
            <p>No reviews available</p>
          )
        ) : (
          <p>Loading reviews...</p>
        )}
      </div>
    </div>
  );
};

export default Product;
