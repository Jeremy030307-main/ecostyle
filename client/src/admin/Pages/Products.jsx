import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../Components/Assets/assets';
import { currency } from '../admin'
import "./Products.css"

const Products = () => {

  const [list,setList] = useState([])

  // const fetchList = async () => {
  //   try{
  //     const response = await axios.get(backendURL + '/api/product/list')
  //     if (response.data.success) {
  //       setList(response.data.products);
  //     } else {
  //       toast.error(response.data.message)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     toast.error(error.message)
  //   }

  // }

  // useEffect(()=> {
  //   fetchList()
  // },[])

  return (
    <>
      <div class="title-container">
        <p>Our Products</p>
        <div>
            <NavLink className="add-product-button" to="/admin/add">
                <img src={assets.add_icon} alt="" />
                <p className='button-word'>Add A Product</p>
            </NavLink>
        </div>
      </div>
      
      <div class="product-list-container">
        {/* List Table Title */}
        <div class="product-list-header">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b class="action-header">Action</b>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div class="product-item" key={index}>
            <img class="product-image" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p class="product-action">X</p>
          </div>
        ))}
      </div>
    </>

  )
}

export default Products