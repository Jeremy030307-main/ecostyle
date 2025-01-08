import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../Components/Assets/assets";
import { currency } from "../../admin";
import "./Products.css";
import {
  useProduct,
  deleteProduct,
} from "../../../apiManager/methods/productMethods";
import ProductDetails from '../../Components/ProductDetails/ProductDetails';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId); // Call deleteProduct API
        // setList((prevList) => prevList.filter((item) => item.id !== productId));
        console.log("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error.message || error);
      }
    }
  };

  const list = useProduct();
  console.log(list);

  if (!list) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="title-container">
        <p className="our-products">Our Products</p>
        <div>
          <NavLink className="add-product-button" to="/admin/add">
            <img src={assets.add_icon} alt="" />
            <p className="button-word">Add A Product</p>
          </NavLink>
        </div>
      </div>

      <div className="product-list-container">
        {/* List Table Title */}
        <div className="product-list-header">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="action-header">Action</b>
        </div>

        {/* Product List */}
        {/* fix image to url link, and add category into getProduct() */}
        {list.map((item, index) => (
          <div className="product-item" key={index} onClick={() => handleProductClick(item)}
          style={{ cursor: 'pointer' }}>
            {/* <img className="product-image" src={item.image[8]} alt="" /> */}
            <p>
              <img className="product-item-img" src={item.thumbnail} alt=""/>
            </p>
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p className="product-action">
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="product-action-button"
                src={assets.delete_icon}
                alt=""
              />
            </p>
          </div>
        ))}
      </div>

      <ProductDetails 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
};

export default Products;
