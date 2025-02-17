import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, useProduct } from "../../../apiManager/methods/productMethods";
import {
  updateProduct,
  updateVariant,
  deleteVariant,
  addSize,
  deleteSize,
} from "../../../apiManager/methods/productMethods";
import {
  increaseStock,
  decreaseStock,
} from "../../../apiManager/methods/stockMethods";
import { getCategory } from "../../../apiManager/methods/categoryMethods";
import { getAllCollection } from "../../../apiManager/methods/collectionMethods";
import CustomSelect from "../../Components/Dropdown/CustomSelect";
import CategorySelectionSection from "../../Components/Dropdown/Dropdown";
import "./EditProduct.css";
import { Link } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  // COLLECTIONS
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(""); // Selected collection

  // CATEGORIES
  const [categories, setCategories] = useState([]); // Full category structure
  const [selectedCategory, setSelectedCategory] = useState(""); // Top-level category ID
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Subcategory ID
  const [nestedSubcategory, setNestedSubcategory] = useState(""); // Nested subcategory ID (if applicable)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();

    const fetchCategories = async () => {
      try {
        const categoryData = await getCategory();
        console.log("All Categories Fetched")
        setCategories(categoryData); // Example: [{id: 'MEN', name: 'Men', subcategories: [...]}, ...]
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    const fetchCollections = async () => {

      try {
        const collection = await getAllCollection();
        console.log("All Collections Fetched")
        setCollections(collection);
      } catch (error) {
        console.error("Error fetching collection:", error);
      }

    }

    fetchCategories();
    fetchCollections();
  }, [id]);

  // Update formData whenever product data changes
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  if (!product || !formData) return <div>Loading...</div>;

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");
    setNestedSubcategory("");
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setNestedSubcategory("");
  };

  const handleNestedSubcategoryChange = (nestedSubcategoryId) => {
    setNestedSubcategory(nestedSubcategoryId);
  };

  const handleCollectionChange = (collectionId) => {
    setSelectedCollection(collectionId);
    setFormData(prev => ({
      ...prev,
      collection: collectionId
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleStockUpdate = async (variantId, size, newQuantity, oldQuantity) => {
    try {
      const difference = newQuantity - oldQuantity;
      if (difference === 0) return;

      let apiResponse;
      if (difference > 0) {
        apiResponse = await increaseStock(id, size, variantId, Math.abs(difference));
      } else {
        apiResponse = await decreaseStock(id, size, variantId, Math.abs(difference));
      }

      setFormData((prevData) => ({
        ...prevData,
        variant: prevData.variant.map((v) => {
          if (v.id === variantId) {
            return {
              ...v,
              stock: {
                ...v.stock,
                [size]: newQuantity,
              },
            };
          }
          return v;
        }),
      }));
    } catch (error) {
      console.error("Error updating stock:", error);
      setFormData((prevData) => ({
        ...prevData,
        variant: prevData.variant.map((v) => {
          if (v.id === variantId) {
            return {
              ...v,
              stock: {
                ...v.stock,
                [size]: oldQuantity,
              },
            };
          }
          return v;
        }),
      }));
      alert(`Failed to update stock: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        collection: formData.collection
      };
      await updateProduct(id, updatedProduct);
      setIsEditing(false);
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
            <button onClick={() => setIsEditing(true)} className="edit-product-header-button">
              Edit Product
            </button>
          )}
          <Link className="button-link" to="../products">
            <button>
              <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
                <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
              </svg>
              <span>Back</span>
            </button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Existing Form Fields */}
        <div className="edit-product-form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
        </div>

        <div className="edit-product-form-group">
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} disabled={!isEditing} />
        </div>

        {/* Category and Collection display/edit section */}
        {!isEditing ? (
          <>
            <div className="edit-product-form-group">
              <label>Category:</label>
              <input type="text" value={formData.category} disabled />
            </div>
            <div className="edit-product-form-group">
              <label>Collection:</label>
              <input type="text" value={formData.collection} disabled />
            </div>
          </>
        ) : (
          <>
            <div className="category-section sm-row">
              <CategorySelectionSection
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                nestedSubcategory={nestedSubcategory}
                handleCategoryChange={handleCategoryChange}
                handleSubcategoryChange={handleSubcategoryChange}
                handleNestedSubcategoryChange={handleNestedSubcategoryChange}
              />
            </div>
            <CustomSelect
              label="Collection"
              value={selectedCollection}
              options={collections}
              onChange={handleCollectionChange}
              placeholder="Select Collection"
            />
          </>
        )}

        {/* Variants Section */}
        <h4>Variants: (Stock Count)</h4>
        <div className="info-section">
          <div className="variants-container">
            {formData.variant.map((v, index) => (
              <div key={index} className="variant-item">
                <img src={v.image} alt={v.name} />
                <p>{v.name}</p>
                <div className="stock-management">
                  {Object.entries(v.stock).map(([size, qty]) => (
                    <div key={size} className="stock-item">
                      <span>{size}: </span>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            handleStockUpdate(v.id, size, newValue, qty);
                          }}
                          className="stock-input"
                        />
                      ) : (
                        <span>{qty}</span>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <button type="button" onClick={() => handleVariantDelete(v.id)} className="delete-button">
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
                setFormData(product);
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
