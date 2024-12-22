import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


const Product = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <p>Product not found!</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <img
        src={product.variant[0]?.image || '/placeholder.png'}
        alt={product.name}
        style={{ width: '300px' }}
      />
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Rating: ⭐ {product.rating || 'No rating'}</p>
      <p>Reviews: {product.reviewCount || 0}</p>
      <h2>Variants:</h2>
      <ul>
        {product.variant.map((variant) => (
          <li key={variant.id}>
            <span style={{ backgroundColor: variant.colorCode }}>
              {variant.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Product;