import './Shop.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import search_icon from '../Components/Assets/search_icon.png';
import { getProduct, useProduct } from '../../apiManager/methods/productMethods';
import { getCategory } from '../../apiManager/methods/categoryMethods';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCategory = location.state?.category || "MEN"; // Default to Men's category ID
  const [categories, setCategories] = useState([]); // State for categories
  const [products, setProducts] = useState([]); // State for products
  const [category, setCategory] = useState(initialCategory); // Selected category ID
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  const productData = useProduct("", { category });
  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        console.log("Fetched categories:", data);
        setCategories(data || []); // Ensure categories array is set
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []); // Only run on component mount

  useEffect(() => {
    if (category) {
      // When the category changes, update products
      setProducts(productData || []);
    }
  }, [category, productData]);

  // Handle navigation to shop with a selected category
  const handleNavigation = (categoryId) => {
    setCategory(categoryId); // Update selected category ID
    navigate('/shop', { state: { category: categoryId } }); // Navigate with category state
    // fetchCategory(categoryId); // Fetch products for the selected category
  };

  const handleProductClick = (product) => {
    navigate('/product', { state: { product } });
  };

  const getCategoryHeading = () => {
    const selectedCategory = categories.find((cat) => cat.id === category);
    return selectedCategory ? selectedCategory.name : "Fashion"; // Default to "Fashion" if category not found
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
              <button onClick={() => handleNavigation('WMN')}>Women's Fashion</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('MEN')}>Men's Fashion</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('KIDS')}>Kids</button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h1>{getCategoryHeading()} Fashion</h1>

        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && products.length === 0 && <p>No products found for this category.</p>}

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
