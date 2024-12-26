import React from 'react';
import { useCart } from '../../CartContext.js';
import Basic_Tee from '../Components/Assets/Product_1.png';
import Pullover_Hoodie from '../Components/Assets/Product_3.png'; 

const products = [
  { id: 1, name: "Eco* Basic Tee", price: 70, image: Basic_Tee },
  { id: 2, name: "Eco* Pullover Hoodie", price: 120, image: Pullover_Hoodie },
];

const Shop = () => {
  const { addItemToCart } = useCart();  // Access the addItemToCart function from context

  return (
    <div className="shop-container">
      <h1>Shop</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.image} alt={product.name} className="product-image" />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">${product.price}</p>
            <button className="add-to-cart-btn" onClick={() => addItemToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
