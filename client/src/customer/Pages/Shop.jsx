import React from 'react'
import { useLocation } from 'react-router-dom';

const Shop = () => {
  const location = useLocation();
  const category = location.state?.category || 'All Products'; // Default to 'All Products'

  return (
    <div>
      <h1>{category}</h1>
      <p>Shop items for {category}</p>
    </div>
  );
};

export default Shop;