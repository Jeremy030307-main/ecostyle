import './Shop.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import search_icon from '../Components/Assets/search_icon.png';
import { getProduct } from '../../apiManager/methods/productMethods';
import { getCategory } from '../../apiManager/methods/categoryMethods';


const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCategory = location.state?.category || "Women's Fashion";
  const [category, setCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products by category
  const fetchCategory = async (category) => {
    try {
      setLoading(true);
      setError('');
      console.log(`Fetching products for category: ${category}`);

      const data = await getProduct("");
      console.log('Fetched products:', data);
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      console.log('Fetched categories:', data);
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
    fetchCategory(category);
  }, [category]);

  const handleNavigation = (category) => {
    setCategory(category);
    navigate('/shop', { state: { category } });
  };

  const handleProductClick = (product) => {
    navigate('/product', { state: { product } });
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="search">
          <div className="search-wrapper">
            <img src={search_icon} className="search_icon" alt="" />
            <input type="text" placeholder="What are you looking for?" />
          </div>
        </div>
        <nav>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => handleNavigation(cat.name)}>
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Welcome to {category}!</h1>

        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && products.length === 0 && <p>No products found.</p>}

        <div className="product-grid">
          {products.map((product) => (
            <button
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.variant[0]?.image || '/placeholder.png'}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <div className="color-swatches">
                {product.variant.map((variant) => (
                  <div
                    key={variant.id}
                    className="color-swatch"
                    style={{ backgroundColor: variant.colorCode }}
                    title={variant.name}
                  />
                ))}
              </div>
              <div className="rating">
                <span className="stars">⭐ {product.rating || 'No rating'}</span>
                <span className="review-count">({product.reviewCount || 0})</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
