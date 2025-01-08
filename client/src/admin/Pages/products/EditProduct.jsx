import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../../apiManager/methods/productMethods";
import {
  updateProduct,
  updateVariant,
  deleteVariant,
  addSize,
  deleteSize,
} from "../../../apiManager/methods/productMethods";
import "./EditProduct.css";
import { Link } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProduct(id); // Using your custom hook
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  // Update formData whenever product data changes
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  if (!product || !formData) return <div>Loading...</div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeDelete = async (sizeToDelete) => {
    try {
      await deleteSize(id, sizeToDelete);
      setFormData((prev) => ({
        ...prev,
        size: prev.size.filter((s) => s !== sizeToDelete),
      }));
    } catch (error) {
      console.error("Error deleting size:", error);
    }
  };

  const handleVariantDelete = async (variantId) => {
    try {
      await deleteVariant(id, variantId);
      setFormData((prev) => ({
        ...prev,
        variant: prev.variant.filter((v) => v.id !== variantId),
      }));
    } catch (error) {
      console.error("Error deleting variant:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        collection: formData.collection,
      };
      await updateProduct(id, updatedProduct);
      setIsEditing(false);
      // Navigate back to products page after successful update
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="edit-product-container">
      <div className="edit-product-header">
        <h2>Edit Product: {formData.name}</h2>
        <div className="edit-product-header-buttons">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-product-header-button"
            >
              Edit Product
            </button>
          )}
          <Link className="button-link" to="../products">
            <button>
              <svg
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 1024 1024"
              >
                <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
              </svg>
              <span>Back</span>
            </button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Collection:</label>
          <input
            type="text"
            name="collection"
            value={formData.collection}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        {/* Sizes Section */}
        <div className="info-section">
          <h3>Sizes</h3>
          <div className="sizes-container">
            {formData.size.map((s, index) => (
              <div key={index} className="size-item">
                <span>{s}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleSizeDelete(s)}
                    className="delete-button"
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Variants Section */}
        <div className="info-section">
          <h3>Color Variants</h3>
          <div className="variants-container">
            {formData.variant.map((v, index) => (
              <div key={index} className="variant-item">
                <div
                  className="color-preview"
                  style={{ backgroundColor: v.colorCode }}
                />
                <img src={v.image} alt={v.name} />
                <p>{v.name}</p>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleVariantDelete(v.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit">Save Changes</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setIsEditing(false);
                setFormData(product); // Reset to original data
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProduct;
