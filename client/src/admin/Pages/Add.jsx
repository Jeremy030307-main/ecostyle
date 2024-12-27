import React, { useState, useEffect } from 'react'
import {assets} from '../Components/Assets/assets'
import './Add.css';
import { addProduct } from '../../apiManager/methods/productMethods';
import { getCategory } from '../../apiManager/methods/categoryMethods.js';
import { getColors } from '../../apiManager/methods/colorMethods';
import { getAllCollection } from '../../apiManager/methods/collectionMethods';


const Add = () => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);


  // COLLECTIONS
  const [collections, setCollections] = useState([{ color: "", image: null }]);
  const [selectedCollection, setSelectedCollection] = useState(""); // Selected collection

  const fetchCollections = async () => {

    try{
      const collection = await getAllCollection();
      console.log("All Collections Fetched")
      setCollections(collection);
    } catch (error){
      console.error("Error fetching collection:", error);
    }

  }

  // VARIANTS
  const [variants, setVariants] = useState([{ color: "", image: null }]);
  const [availableColors, setAvailableColors] = useState([]);
  const fetchColors = async () => {

    try{
      const colors = await getColors();
      console.log("All Colors Fetched")
      setAvailableColors(colors);
    } catch (error){
      console.error("Error fetching colors:", error);
    }

  };

  // Handle color selection
  const handleColorChange = (index, color) => {
    const updatedVariants = [...variants];
    updatedVariants[index].color = color;
    setVariants(updatedVariants);
  };

  // Handle image upload
  const handleImageUpload = (index, file) => {
    const updatedVariants = [...variants];
    updatedVariants[index].image = file; // Store the file object
    setVariants(updatedVariants);
  };

  // Add a new variant
  const addVariant = () => {
    setVariants([...variants, { color: "", image: null }]);
  };

  // Remove a variant
  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  // CATEGORIES
  const [categories, setCategories] = useState([]); // Full category structure
  const [selectedCategory, setSelectedCategory] = useState(""); // Top-level category ID
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Subcategory ID
  const [nestedSubcategory, setNestedSubcategory] = useState(""); // Nested subcategory ID (if applicable)

  const fetchCategories = async () => {
    try {
      const categoryData = await getCategory();
      console.log("All Categories Fetched")
      setCategories(categoryData); // Example: [{id: 'MEN', name: 'Men', subcategories: [...]}, ...]
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  // Handle top-level category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(""); // Reset subcategory when parent changes
    setNestedSubcategory(""); // Reset nested subcategory when parent changes
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setNestedSubcategory(""); // Reset nested subcategory when subcategory changes
  };

  // Handle nested subcategory selection
  const handleNestedSubcategoryChange = (nestedSubcategoryId) => {
    setNestedSubcategory(nestedSubcategoryId);
  };


  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchCollections();
  }, []);

  
  // 1. Material and fit (Nid implement or can dont need)
  // 2. Change thumbnail and variant images to URL
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      const productData = {
        name: name,
        price: price,
        thumbnail: "image1",
        size: sizes,
        details: {
          description: description,
          material: "100% Cotton",
          fit: "Regular"
        },
        category: selectedCategory,
        collection: selectedCollection,
        variant: variants
      };
    
      await addProduct(productData)
        .then(response => {
          console.log("Product added successfully:", productData);
        })
        .catch(error => {
          console.error("Error adding product:", error);
        });

    } catch(error) {
      console.log("Error Dumbbitch")
    }
  }
  
  return (
    <form onSubmit={onSubmitHandler} className="add-form">
      {/* Images */}
      <div>
        <p className="upload-section">Upload Image</p>
        <div className="upload-images">
          <label className="upload-label" htmlFor="image1">
            <img src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" />
          </label>
          <label className="upload-label" htmlFor="image2">
            <img src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" />
          </label>
          <label className="upload-label" htmlFor="image3">
            <img src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" />
          </label>
          <label className="upload-label" htmlFor="image4">
            <img src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" />
          </label>
        </div>
      </div>

      {/* Name */}
      <div className="w-full">
        <p className="upload-section">Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className="input-field" type="text" placeholder="Type Here" required />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="upload-section">Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className="textarea-field" placeholder="Write Content Here" required></textarea>
      </div>

      <div className="category-section sm-row">
        {/* Catategory Dropdown */}
        <div>
          <p className="upload-section">Category</p>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown */}
        {selectedCategory && (
          <div>
            <p className="upload-section">Subcategory</p>
            <select
              value={selectedSubcategory}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {categories
                .find((category) => category.id === selectedCategory)
                ?.subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Nested Subcategory Dropdown */}
        {selectedSubcategory && (
          <div>
            <p className="upload-section">Sub subcategory</p>
            <select
              value={nestedSubcategory}
              onChange={(e) => handleNestedSubcategoryChange(e.target.value)}
            >
              <option value="">Select Nested Subcategory</option>
              {categories
                .find((category) => category.id === selectedCategory)
                ?.subcategories.find(
                  (subcategory) => subcategory.id === selectedSubcategory
                )
                ?.subcategories.map((nested) => (
                  <option key={nested.id} value={nested.id}>
                    {nested.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Price */}
        <div>
          <p className="upload-section">Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className="input-field category-price-input" type="number" placeholder="25" />
        </div>

      </div>

      {/* Collection*/}
      <div>
      <p className="upload-section">Collection</p>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="">Select Collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Sizes */}
      <div>
        <p className="upload-section">Product Sizes</p>
        <div className="size-options">
          <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev,"S"])} className="size-option">
            <p className={`${sizes.includes("S") ? "bg-green-100" : "bg-slate-200"}`}>S</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev,"M"])} className="size-option">
            <p className={`${sizes.includes("M") ? "bg-green-100" : "bg-slate-200"}`}>M</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev,"L"])} className="size-option">
            <p className={`${sizes.includes("L") ? "bg-green-100" : "bg-slate-200"}`}>L</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev,"XL"])} className="size-option">
            <p className={`${sizes.includes("XL") ? "bg-green-100" : "bg-slate-200"}`}>XL</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev,"XXL"])} className="size-option">
            <p className={`${sizes.includes("XXL") ? "bg-green-100" : "bg-slate-200"}`}>XXL</p>
          </div>
        </div>
      </div>
      
      {/* Variances */}
      <div>
        <p className="upload-section">Variances</p>
        {/* Adding Variant (Colors and Images) */}
        {variants.map((variant, index) => (
          <div key={index} className="variant-row">
            {/* Dropdown for selecting color */}
            <select
              value={variant.color}
              onChange={(e) => handleColorChange(index, e.target.value)}
            >
              <option value="">Select Color</option>
              {availableColors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>

            {/* Display color preview */}
            {variant.color && (
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor:
                    availableColors.find((color) => color.id === variant.color)
                      ?.colorCode || "#000",
                  marginLeft: "10px",
                  borderRadius: "50%",
                }}
              ></span>
            )}

            {/* Image upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(index, e.target.files[0])}
            />

            {/* Image preview */}
            {variant.image && (
              <img
                src={URL.createObjectURL(variant.image)} // Temporary preview
                alt="Preview"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  marginLeft: "10px",
                }}
              />
            )}

            {/* Remove variant button */}
            <button onClick={() => removeVariant(index)}>Remove</button>
          </div>
        ))}

        {/* Add new variant */}
        <button onClick={addVariant}>Add Variant</button>
      </div>
      
      <button type="submit" className="submit-button">ADD</button>
    </form>

  );
}

export default Add