import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../CartContext"; // Import the Cart Context
import { useWishlist } from "../../WishlistContext"; // Import Wishlist Context
import "./Product.css"; // CSS file for styling
import {
  createNewReview,
  getProductReview,
} from "../../apiManager/methods/reviewMethods";
import { useProduct } from "../../apiManager/methods/productMethods";
import { RatingStar, SmallRatingStar } from "./RatingStart";
import ReviewModal from "../Components/Review Modal/ReviewModal";
import { decreaseStock, increaseStock } from "../../apiManager/methods/stockMethods";

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

  const {addItemToCart} = useCart()
  const { productID } = useParams();
  const product = useProduct(productID);
  const {addItemToWishlist,removeItemFromWishlist, preesntInWishlist, wishlistItems} = useWishlist();
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  useEffect(() => {
    const test = async() => {
      try {
        decreaseStock("ES00000", "L", "BG", 5)
      } catch (error) {
        console.log(error.message)
      }
    }

    test()
  })

  useEffect(() => {
    if (product){
        setAddedToWishlist(preesntInWishlist(product.id))
    }
}, [preesntInWishlist, product, wishlistItems])

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
  const fetchReview = async () => {
    try {
      const data = await getProductReview(productID);
      setReview(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleReviewSubmitted =async (productID, rating, comment) =>{
    await createNewReview(productID, rating, comment);
    await fetchReview()
  }

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
            <button className="fav-btn" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigate from triggering

                if (product){
                  if (addedToWishlist) {
                    // If the item is already added, remove it from the wishlist
                    removeItemFromWishlist(product.id);
                    } else {
                    // If the item is not added, add it to the wishlist
                    addItemToWishlist(product.id);
                    }
                }

                console.log("Button clicked!"); // Handle button action
                }}
                >
              {addedToWishlist ? (<i class="fa-solid fa-heart"></i>): (<i class="fa-regular fa-heart"></i>)}
              
            </button>
            <button className="add-to-cart-btn" onClick={() => {addItemToCart(productID, selectedVariant, selectedSize)}}>
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
