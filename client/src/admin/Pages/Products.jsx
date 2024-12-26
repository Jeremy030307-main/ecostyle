import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../Components/Assets/assets';
import { currency } from '../admin'
import "./Products.css"
import { getCategory } from '../../apiManager/methods/categoryMethods';

const Products = () => {

  const [list,setList] = useState([])

  const [categoryData, setCategoryData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
    
        useEffect(() => {
            const fetchCategory = async () => {
                try {
                  const data = await getCategory();
                  console.log(data)
                    
                } catch (err) {
                    setError(err.message); // Handle error
                    console.error(err);
                } finally {
                    setLoading(false); // Stop loading when request is done
                }
            };
    
            fetchCategory(); // Fetch data when component mounts or categoryID changes
        }, []); // Dependency array: only rerun if categoryID changes

  return (
    <>
      <div className="title-container">
        <p>Our Products</p>
        <div>
            <NavLink className="add-product-button" to="/admin/add">
                <img src={assets.add_icon} alt="" />
                <p className='button-word'>Add A Product</p>
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
        {list.map((item, index) => (
          <div className="product-item" key={index}>
            <img className="product-image" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p className="product-action">X</p>
          </div>
        ))}
      </div>
    </>

  )
}

export default Products