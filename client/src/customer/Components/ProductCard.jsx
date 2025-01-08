import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SmallRatingStar } from "../Pages/RatingStart";
import "../Pages/Shop.css";
import { useWishlist } from "../../WishlistContext";

const ProductCard = ({productData}) => {

    const {addItemToWishlist,removeItemFromWishlist, preesntInWishlist, wishlistItems} = useWishlist();
    const [selectImage, setSelectImage] = useState(productData.thumbnail)
    const [isHovered, setIsHovered] = useState(false); // State to track hover
    const navigate = useNavigate()

    const [addedToWishlist, setAddedToWishlist] = useState(false);

    useEffect(() => {
        setAddedToWishlist(preesntInWishlist(productData.id))
    }, [preesntInWishlist, productData.id, wishlistItems])
    
    return (
        <div 
        className="shop-productCard" 
        onClick={() => navigate(`/product/${productData.id}`)}
        onMouseEnter={() => setIsHovered(true)} // Trigger hover state
        onMouseLeave={() => setIsHovered(false)} // Reset hover state
        >
        <div className="product-card-image-container">

            {/* Button only visible on hover */}
            {isHovered && (
            <button
                className="product-card-top-right-button"
                onClick={(e) => {
                e.stopPropagation(); // Prevent navigate from triggering

                if (addedToWishlist) {
                // If the item is already added, remove it from the wishlist
                removeItemFromWishlist(productData.id);
                } else {
                // If the item is not added, add it to the wishlist
                addItemToWishlist(productData.id);
                }

                console.log("Button clicked!"); // Handle button action
                }}
            >
                {!addedToWishlist ? (
                <i class="fa-regular fa-heart fa-lg"></i>
                ):(
                <i class="fa-solid fa-heart fa-xl"></i>
                )} 
            </button>
            
            )}

            <img
            src={selectImage || "/placeholder.png"}
            alt={productData.name}
            className="shop-product-image"
            />
        </div>

        <div className="product-card-info-container">

        <div className="shop-color-swatches">
            {productData.variant.map((variant) => (
            <div
                key={variant.id}
                className="shop-color-swatch"
                style={{ backgroundColor: variant.colorCode }}
                title={variant.name}
                onClick={(e) => {
                e.stopPropagation();
                setSelectImage(variant.image)
                }}
            />
            ))}
        </div>

        <div style={{paddingTop: "40px", alignItems: "start", display: "flex", flexDirection: "column"}}>
            <h4>{productData.name}</h4>
            <p>RM {productData.price}</p>

            <div className="product-card-review-container">
            {productData.reviewCount && productData.reviewCount>0 ? (
            <>
                <SmallRatingStar rating={productData.rating}/>
                <p>({productData.reviewCount})</p>
            </>
            
            ): (
            <p>This product has no reviews.</p>
            )}
            </div>
        </div>
        </div>
        </div>

    )
    }

export default ProductCard