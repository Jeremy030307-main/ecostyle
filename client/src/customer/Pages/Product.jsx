import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../CartContext";
import { useWishlist } from "../../WishlistContext";
import "./Product.css";
import {
  createNewReview,
  getProductReview,
} from "../../apiManager/methods/reviewMethods";
import { getProduct, useProduct } from "../../apiManager/methods/productMethods";
import { RatingStar, SmallRatingStar } from "./RatingStart";
import ReviewModal from "../Components/Review Modal/ReviewModal";

const ReviewCard = ({ review }) => {
  return (
    <>
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
      <hr style={{opacity:"0.5"}}/>
    </>
  );
};

const Product = () => {
  const { addItemToCart } = useCart();
  const { productID } = useParams();
  const { addItemToWishlist, removeItemFromWishlist, preesntInWishlist, wishlistItems } = useWishlist();
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReview] = useState([]);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setVariant] = useState(null);
  const [selectedSize, setSize] = useState("S");
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchReview = async () => {
    try {
      const data = await getProductReview(productID);
      setReview(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(productID);
        setProduct(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    
    fetchProduct();
    fetchReview();
  }, [productID]);

  useEffect(() => {
    if (product) {
      setAddedToWishlist(preesntInWishlist(product.id));
    }
  }, [preesntInWishlist, product, wishlistItems]);

  useEffect(() => {
    if (product) {
      setVariant(product.variant[0].id);
      setSize(product.size[0]);
      setSelectedImage(product.thumbnail);
    }
  }, [product]);

  const handleReviewSubmitted = async (productID, rating, comment) => {
    await createNewReview(productID, rating, comment);
    await fetchReview();
  };

  if (!product) {
    return <p>Product not found!</p>;
  }

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
          <div>
            <h1 className="product-name">{product.name}</h1>
            {product?.rating && product?.reviewCount ? (
              <div className="product-rating-reviewCount">
                <RatingStar rating={product.rating} />
                <p>({product.reviewCount})</p>
              </div>
            ) : (
              <p>This product has no reviews yet.</p>
            )}
            <p className="product-price">${product.price.toFixed(2)}</p>
          </div>

          <div className="product-selection">
            <h2>Available Colors</h2>
            <div className="product-colors">
              {product.variant?.map((variant) => (
                <div
                  key={variant.id}
                  className={`color-swatch ${selectedVariant === variant.id ? "selected" : ""}`}
                  style={{ backgroundColor: variant.colorCode }}
                  onClick={() => {
                    setSelectedImage(variant.image);
                    setVariant(variant.id);
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="product-selection">
            <div className="size-section-header">
              <h2>Available Sizes</h2>
              <button 
                className="size-guide-link"
                onClick={() => setIsSizeGuideOpen(true)}
              >
                Size Guide
              </button>
            </div>
            <div className="product-sizes">
              {product.size?.map((size, index) => (
                <button
                  key={index}
                  className={`size-button ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="fav-btn" 
              onClick={(e) => {
                e.stopPropagation();
                if (product) {
                  addedToWishlist 
                    ? removeItemFromWishlist(product.id)
                    : addItemToWishlist(product.id);
                }
              }}
            >
              {addedToWishlist 
                ? <i className="fa-solid fa-heart"></i>
                : <i className="fa-regular fa-heart"></i>}
            </button>
            <button 
              className="add-to-cart-btn" 
              onClick={() => addItemToCart(productID, selectedVariant, selectedSize)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="product-review-section-header">
          <h1>Reviews</h1>
          {product?.rating && product?.reviewCount ? (
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
        {reviews?.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p>No reviews available</p>
        )}
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="size-guide-modal">
          <div className="size-guide-content">
            <button 
              className="close-button"
              onClick={() => setIsSizeGuideOpen(false)}
            >
              &times;
            </button>
            <h2>Size Guide</h2>
            <table className="size-chart">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Waist (in)</th>
                  <th>Hip (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>34-36</td>
                  <td>28-30</td>
                  <td>36-38</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>38-40</td>
                  <td>32-34</td>
                  <td>40-42</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>42-44</td>
                  <td>36-38</td>
                  <td>44-46</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>46-48</td>
                  <td>40-42</td>
                  <td>48-50</td>
                </tr>
              </tbody>
            </table>
            <p className="size-note">
              * Measurements are body dimensions, not garment dimensions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;