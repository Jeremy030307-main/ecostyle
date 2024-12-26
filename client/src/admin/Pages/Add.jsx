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
  // const [category,setCategory] = useState("Men");
  // const [subCategory,setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // const [categories, setCategories] = useState([]); // State to store fetched categories
  // const [error, setError] = useState(null); // State for error handling

  // const [category, setCategory] = useState(""); // Selected category state
  // const [subCategory, setSubCategory] = useState(""); // Selected subcategory state
  // const [subCategories, setSubCategories] = useState([]); // Subcategories of the selected category

  // COLLECTIONS
  const [collections, setCollections] = useState([{ colorID: "", image: null }]);
  const fetchCollections = async () => {

    try{
      const collection = await getAllCollection();
      console.log("All Collections Fetched", collection)
      setCollections(collection);
    } catch (error){
      console.error("Error fetching collection:", error);
    }

  }

  // VARIANTS
  const [variants, setVariants] = useState([{ colorID: "", image: null }]);
  const [availableColors, setAvailableColors] = useState([]);
  const fetchColors = async () => {

    try{
      const colors = await getColors();
      console.log("All Colors Fetched", colors)
      setAvailableColors(colors);
    } catch (error){
      console.error("Error fetching colors:", error);
    }

  };

  // Handle color selection
  const handleColorChange = (index, colorID) => {
    const updatedVariants = [...variants];
    updatedVariants[index].colorID = colorID;
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
    setVariants([...variants, { colorID: "", image: null }]);
  };

  // Remove a variant
  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const fetchCategories = async () => {

    try{
      const data = await getCategory();
      console.log("data")
    } catch (error){

    }
  }

  // Fetch categories on component mount
  useEffect(() => {
    // fetchCategories();
    // fetchColors();
    fetchCollections();
  }, []);

  // Update subcategories when a category is selected
  // const handleCategoryChange = (e) => {
  //   const selectedCategoryID = e.target.value;
  //   setCategory(selectedCategoryID);

  //   // Find the selected category in the categories list
  //   const selectedCategory = categories.find((cat) => cat.id === selectedCategoryID);
  //   if (selectedCategory && selectedCategory.subcategories) {
  //     setSubCategories(selectedCategory.subcategories);
  //   } else {
  //     setSubCategories([]); // Clear subcategories if none exist
  //   }
  // };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // try {

    //   const productData = {
    //     name: name,
    //     price: price,
    //     thumbnail: image1,
    //     sizes: [JSON.stringify(sizes)],
    //     details: {
    //       description: description,
    //       material: "100% Cotton",
    //       fit: "Regular"
    //     },
    //     category: category,
    //     collection: "summer2024",
    //     variant: [
    //       variants
    //     ]
    //   };
    
    //   await addProduct(productData)
    //     .then(response => {
    //       console.log("Product added successfully:", response);
    //     })
    //     .catch(error => {
    //       console.error("Error adding product:", error);
    //     });
      


    // } catch(error) {

    // }

  }
  
  return (
    <form onSubmit={onSubmitHandler} className="add-form">
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

      <div className="w-full">
        <p className="upload-section">Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className="input-field" type="text" placeholder="Type Here" required />
      </div>

      <div className="w-full">
        <p className="upload-section">Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className="textarea-field" placeholder="Write Content Here" required></textarea>
      </div>

      <div className="category-section sm-row">
        {/* <div>
          <p className="upload-section">Product Category</p>
            <select onChange={handleCategoryChange} className="select-field">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
        </div>

        {subCategories.length > 0 && (
          <div>
            <p className="upload-section">Subcategory</p>
            <select onChange={(e) => setSubCategory(e.target.value)} className="select-field">
              <option value="">Select Subcategory</option>
              {subCategories.map((subCat) => (
                <option key={subCat.id} value={subCat.id}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>
        )} */}

        {/* <div>
          <p className="upload-section">Collection</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} className="select-field">
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </div> */}

        <div>
          <p className="upload-section">Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className="input-field category-price-input" type="number" placeholder="25" />
        </div>

      </div>

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


      {/* Adding Variant (Colors and Images) */}
      {variants.map((variant, index) => (
        <div key={index} className="variant-row">
          {/* Dropdown for selecting color */}
          <select
            value={variant.colorID}
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
          {variant.colorID && (
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                backgroundColor:
                  availableColors.find((color) => color.id === variant.colorID)
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

      <button type="submit" className="submit-button">ADD</button>
    </form>

  );
}

export default Add