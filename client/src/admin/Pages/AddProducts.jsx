import React, { useState, useEffect } from 'react'
import {assets} from '../Components/Assets/assets.js'
import './AddProducts.css';
import { addProduct } from '../../apiManager/methods/productMethods.js';
import { getCategory } from '../../apiManager/methods/categoryMethods.js';
import { getColors } from '../../apiManager/methods/colorMethods.js';
import { getAllCollection } from '../../apiManager/methods/collectionMethods.js';
import { Link } from 'react-router-dom';
import CategorySelectionSection from '../Components/Dropdown/Dropdown.jsx';
import CustomSelect from '../Components/Dropdown/CustomSelect.jsx';
import VariantSelector from '../Components/Dropdown/VariantSelector.jsx';


const AddProducts = () => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);


  // COLLECTIONS
  const [collections, setCollections] = useState([]);
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
        price: Number(price),
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
          window.location.reload();
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
        <div className='title-container'>
          <p className="title">Upload Image</p>
          <Link className='button-link' to="../products">
            <button>
                <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
              <span>Back</span>
            </button>
          </Link>
        </div>

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

      {/* Price */}
      <div>
        <p className="upload-section">Product Price</p>
        <input onChange={(e)=>setPrice(e.target.value)} value={price} className="input-field category-price-input" type="number" placeholder="25" />
      </div>

      {/* Category */}
      <div className="category-section sm-row">
        {/* Catategory Dropdown */}
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

      {/* Collection */}
      <CustomSelect
        label="Collection"
        value={selectedCollection}
        options={collections}
        onChange={setSelectedCollection}
        placeholder="Select Collection"
      />
      
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
      
      <VariantSelector
        variants={variants}
        availableColors={availableColors}
        handleColorChange={handleColorChange}
        handleImageUpload={handleImageUpload}
        removeVariant={removeVariant}
      />

      {/* Add new variant */}
      <button onClick={addVariant}>Add Variant</button>
  
      <button type="submit" className="submit-button">ADD</button>
    </form>

  );
}

export default AddProducts