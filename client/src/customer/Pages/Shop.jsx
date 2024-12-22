import './Shop.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import search_icon from '../Components/Assets/search_icon.png';
import { getProduct } from '../../apiManager/methods/productMethods';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCategory = location.state?.category || "Women's Fashion";
  const [category, setCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchCategory(category);
  }, [category]);

  const handleNavigation = (category) => {
    setCategory(category);
    navigate('/shop', { state: { category } });
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
            <li>
              <button onClick={() => handleNavigation("Women's Fashion")}>
                Women's Fashion
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("Men's Fashion")}>
                Men's Fashion
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation("Kids")}>
                Kids
              </button>
            </li>
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
            <div className="product-card" key={product.id}>
              {/* Display the first variant's image */}
              <img
                src={product.variant[0]?.image || '/placeholder.png'}
                alt={product.name}
                className="product-image"
              />

              {/* Product Name */}
              <h3 className="product-name">{product.name}</h3>

              {/* Price */}
              <p className="product-price">${product.price.toFixed(2)}</p>

              {/* Variants: Color Swatches */}
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

              {/* Rating and Review Count */}
              <div className="rating">
                <span className="stars">⭐ {product.rating || 'No rating'}</span>
                <span className="review-count">({product.reviewCount || 0})</span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default Shop;
