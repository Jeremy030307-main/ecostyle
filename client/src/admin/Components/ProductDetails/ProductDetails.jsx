import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductDetails.css";

const ProductDetails = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const {
    name = "",
    price = 0,
    thumbnail = "",
    category = "",
    collection = "",
    size = [],
    variant = [],
    rating = 0,
    reviewCount = 0,
    color = [],
  } = product;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{name}</h2>
          <button
            className="edit-button"
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
          >
            Edit Product
          </button>
        </div>

        <div className="modal-body">
          <div className="thumbnail-image">
            <img src={thumbnail} alt={name} />
          </div>

          <div className="product-info">
            <div className="product-details-info-section">
              <h3>Product Details</h3>
              <p>
                <strong>Price:</strong> ${price}
              </p>
              <p>
                <strong>Category:</strong> {category}
              </p>
              <p>
                <strong>Collection:</strong> {collection}
              </p>
              <p>
                <strong>Rating:</strong> {rating ? rating.toFixed(1) : "0.0"} ({reviewCount ? reviewCount : "0"}{" "}
                reviews)
              </p>
            </div>

            {size.length > 0 && (
              <div className="product-details-info-section">
                <h3>Sizes</h3>
                <div className="sizes-container">
                  {size.map((s, index) => (
                    <span key={index} className="size-badge">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          {variant.length > 0 && (
            <div className="product-details-info-section">
              <h3>Color Variants</h3>
              <div className="variants-container">
                {variant.map((v, index) => (
                  <div key={index} className="product-details-variant-item">
                    <img src={v.image} alt={v.name} />
                    <p>{v.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
