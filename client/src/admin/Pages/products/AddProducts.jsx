import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import './AddProducts.css';
import { addProduct } from '../../../apiManager/methods/productMethods.js';
import { getCategory } from '../../../apiManager/methods/categoryMethods.js';
import { getAllCollection } from '../../../apiManager/methods/collectionMethods.js';
import CustomSelect from '../../Components/Dropdown/CustomSelect.jsx';
import { getColors } from '../../../apiManager/methods/colorMethods.js';


const SizeSelector = ({sizeOptions, productSize, setProductSize}) => {

  const handleSizeChange = (event) => {
    const { value, checked } = event.target;

    setProductSize((prevSizes) => {
      if (checked) {
        return [...prevSizes, value]; // Add selected size
      } else {
        return prevSizes.filter((size) => size !== value); // Remove deselected size
      }
    });
  };

  return (
    <div className="size-options">
      {sizeOptions.map((size) => (
      <div key={size}>
        <input
          type="checkbox"
          id={`size-${size}`}
          name="size"
          value={size}
          checked={productSize.includes(size)}
          onChange={handleSizeChange}
          hidden
        />
        <label htmlFor={`size-${size}`} className="size-box">
          {size}
        </label>
      </div>
    ))}
    </div>
  )

}

const VariantContainer = ({productVariant, setProductVariant}) => {

  const [addingVariant, setAddingVariant] = useState(false)
  const [variantColor, setVariantColor] = useState("")
  const [color, setColor] = useState();
  const [file, setFile] = useState();
  const [viewFile, setViewFile] = useState()

  useEffect(()=> {
    const fetchData = async ()=>{
      const data = await getColors();
      setColor(data)
    }

    fetchData()
  }, [])
  const handleChange = (event) => {
    const file = event.target.files[0];
    setFile(file)
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setViewFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVariant = (event) => {
    event.preventDefault(); // Prevent form submission and page reload

    if (!variantColor || !file) {
      alert("Please select a color and upload an image.");
      return;
    }

    // Append new variant to the existing array
    setProductVariant([...productVariant, { color: variantColor, image: file }]);

    // Reset fields after saving
    setVariantColor("");
    setFile();
    setViewFile();
    setAddingVariant(false)
  };

  const handleDeleteVariant = (variantToDelete) => {
    // Filter out the variant that matches the one to delete
    const updatedVariants = productVariant.filter(
      (variant) => variant.color !== variantToDelete.color || variant.image !== variantToDelete.image
    );
  
    // Update the state with the filtered array
    setProductVariant(updatedVariants);
  };

  const [variantView, setVariantView] = useState("")
  useEffect(() => {
    if (productVariant.length >= 1){
      setVariantView(productVariant[0])
    }

  }, [productVariant])
  return (
    <> 
    {addingVariant ? (
      <div className='add-new-variant-container'>
        
        <label
        htmlFor="file-upload"
        className="upload-box"
        style={{
          backgroundImage: viewFile ? `url(${viewFile})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!file && <span className="upload-text">+</span>}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>

        <div style={{padding: "10px 0"}}>
          <label htmlFor="variantColor">Variant Color</label>
          <p style={{fontSize: "12px", opacity: "0.7"}}>Pick Available Color</p>
          <CustomSelect
          label="Color"
          value={variantColor}
          options={color}
          onChange={setVariantColor}
          placeholder="Select Color"
          nolabel={true}
          bgcolor={"#c2c2c2"}
          />

        </div>

      <button onClick={()=>{setAddingVariant(false)}}>Cancel</button>
      <button onClick={handleSaveVariant} disabled={!file || !variantColor}>Save</button>
      </div>
    ):(
        productVariant.length <= 0 ? (
          <div className='variant-empty-state '>
            <div className="variant-empty-content" onClick={() => {setAddingVariant(true)}}>
              <div className="variant-empty-card" >
                <svg className="variant-empty-icon" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <p className="variant-empty-message">No variants created yet</p>
              </div>
            </div>
          </div>
        ):(
          <div>

            <div className='new-variant-box'>
              <img src={variantView ? URL.createObjectURL(variantView.image) : "none"} alt="" className='upload-box'/>
            <p>Color: {variantView ? variantView.color: "" }</p>

            <div className="horizotal-variants-selector">
              {productVariant.map((variant) => (
                <>
                <img 
                src={variant ? URL.createObjectURL(variant.image) : "none"} 
                alt=""
                className="horizontal-variants-seletor-small-box"                 
                onClick={()=>{setVariantView(variant)}}/>
                  <button className="variant-selector-close-button" onClick={() => handleDeleteVariant(variant)}>✕</button>
              </>
              ))}

              <div
                className="horizontal-variants-seletor-add-box"
                onClick={()=>{setAddingVariant(true)}}
              > +</div>
            </div>
            </div>

          </div>
        )
    )}

    </>
  )

}

const CategoryMenu = ({ categories, level = 0, productCategory, setProductCategory, setSelectCategory}) => {

  return (
    <ul className='add-product-category-selection'>
      {categories.map((category) => (
        <li key={category.id} >
          <div
            style={{
              paddingLeft: `${level * 20}px`,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}

            className="add-product-category-individual-container"
            onClick={()=>{setProductCategory(category.id);console.log(category.id); setSelectCategory(false)}}
          >
            <span>{category.name}</span>
            {/* Icon based on expanded/collapsed state */}

          </div>

          {/* Animate the subcategories */}
          {category.subcategories &&
            category.subcategories.length > 0 &&
            (
              <div
                className="add-product-category-subcategories-container"
                style={{ transition: 'all 0.3s ease-in-out', overflow: 'hidden' }}
              >
                <CategoryMenu
                  categories={category.subcategories}
                  level={level + 1}
                  productCategory={productCategory}
                  setProductCategory={setProductCategory}
                  setSelectCategory={setSelectCategory}
                />
              </div>
            )}
        </li>
      ))}
    </ul>
  );
};

const AddProducts = () => {

  const navigate = useNavigate()
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productCollection, setProductCollection] = useState("")
  const [productPrice, setProductPrice] = useState(0)
  const [productSize, setProductSize] = useState([])
  const [productStock, setProductStock] = useState(0)
  const [productVariants, setProductVariants] = useState([])
  const [productCategory, setProductCategory] = useState("")

  const [collections, setCollections] = useState([])
  const [categories, setCategoies] = useState([])

  // fetch collection and category
  useState(() => {
    const fetchInformation = async() => {
      try {
        const collectionsData = await getAllCollection()
        const categoryData = await getCategory()
        setCollections(collectionsData)
        setCategoies(categoryData)

      } catch (error) {
        console.log(error.message)
      }
    }

    fetchInformation()
  }, [])

  const [selectCategory, setSelectCategory] = useState(false)

  const handleCreateProduct = async (e) => {

    e.preventDefault()
    await addProduct({
      name: productName,
      price: productPrice,
      size: productSize,
      details: {
        description: productDescription
      },
      category: productCategory,
      collection: productCollection,
      variant: productVariants
    })
    navigate("../products")

  }

  return (

    <div>

      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h2>Add New Product</h2>

        <button 
          onClick={handleCreateProduct} 
          disabled={!productName || !productDescription || !productCollection || !productCategory || productSize.length <= 0 || productPrice<=0 || productVariants.length<=0}
          className='add-new-product-btn'
        >
            Save Product
        </button>
      </div>

      <div className='add-new-product-container'>

        <div className='add-new-product-information-container'>

          {/* general information */}
          <div className='add-new-product-general-container'>
            <h3>General Information</h3><br />

            {/* product name */}
            <label htmlFor="productName">Product Name</label> <br />
            <input 
              className="product-input" 
              type="text" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)}
            />

            {/* product description */}
            <label htmlFor="productDescription">Product Description</label> <br />
            <textarea 
              className="product-input" 
              placeholder="Describe your product in detail..."
              value={productDescription} 
              onChange={(e) => setProductDescription(e.target.value)}
              maxLength={500} 
            />

            {/* product size and collection */}
            <div style={{display: "flex", gap: "20px"}}>

              {/* size */}
              <div>
                <label htmlFor="productSize">Size</label> <br />
                <p style={{fontSize: "12px", opacity: "0.7"}}>Pick Available Size</p>

                 <SizeSelector sizeOptions={["S", "M", "L", "XL", "XXL"]} productSize={productSize} setProductSize={setProductSize}/>

              </div>

              {/* collection */}
              <div>

              <label htmlFor="productCollection">Collection</label> <br />
              <p style={{fontSize: "12px", opacity: "0.7"}}>Pick Available Collection </p>

              <CustomSelect
                label="Collection"
                value={productCollection}
                options={collections}
                onChange={setProductCollection}
                placeholder="Select Collection"
                nolabel={true}
                bgcolor={"#c2c2c2"}
              />

              </div>
            </div>
            
          </div>

          {/* pricing and stock */}
          <div className='add-new-product-general-container'>
            <h3>Pricing And Stock</h3><br />

            <div style={{display: "flex", gap: "20px", width: "100%"}}>

              {/* stock */}
              <div style={{flex: "1"}}>
                <label htmlFor="productPrice">Base Pricing</label> <br />
                <input 
                  className="product-input" 
                  type="number" 
                  id="productPrice"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              {/* stock */}
              <div style={{flex: "1"}}>
                <label htmlFor="productStock">Stock</label> <br />
                <input 
                  className="product-input" 
                  type="number" 
                  id="productStock"
                  value={productStock}
                  onChange={(e) => setProductStock(Number(e.target.value))}
                  min="0"
                  step="1"
                  placeholder="0"
                />
              </div>

            </div>
            
          </div>

        </div>

        <div className='add-new-product-subgeneral-container'>
          

          {/* Variant */}
          <div className='add-new-product-variant-container'>
            <h3>Variant</h3>

            <VariantContainer 
            productVariant={productVariants}
            setProductVariant={setProductVariants}/>
          </div>

          {/* Category */}
          <div className='add-new-product-category-container'>
            <h3>Category</h3>

            <button className='add-new-product-selecting-category-btn' onClick={()=>{setSelectCategory(true)}}>{productCategory ? productCategory:"Select Category"}</button>

            {selectCategory && 
              <div className="modal" onClick={()=>{setSelectCategory(false)}}>
                <div class="modal-content">
                  <span class="close" onClick={()=>{setSelectCategory(false)}}>&times;</span>

                  <h2>Select A Category</h2>
                  <div style={{padding: "20px"}}>
                    <CategoryMenu categories={categories} productCategory={productCategory} setProductCategory={setProductCategory} setSelectCategory={setSelectCategory}/>
                  </div>
                </div>
              </div>
              }
          </div>
        </div>

      </div>
    </div>

  );
}

export default AddProducts