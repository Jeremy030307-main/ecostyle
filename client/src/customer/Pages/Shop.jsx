import './Shop.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import search_icon from '../Components/Assets/search_icon.png';
import { getProduct } from '../../apiManager/methods/productMethods';
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

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const data = await getCategory(); // Fetch categories from API
      console.log("Fetched categories:", data);
      setCategories(data || []); // Ensure categories array is set
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch products for a selected category
  const fetchCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError('');
      console.log(`Fetching products for category ID: ${categoryId}`);

      const data = await getProduct("", { category: categoryId }); // Pass category ID
      console.log("Fetched products:", data);
      setProducts(data || []); // Update products state with fetched data
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to shop with a selected category
  const handleNavigation = (categoryId) => {
    setCategory(categoryId); // Update selected category ID
    navigate('/shop', { state: { category: categoryId } }); // Navigate with category state
    fetchCategory(categoryId); // Fetch products for the selected category
  };

  // Fetch categories and initial products on component mount
  useEffect(() => {
    fetchCategories(); // Fetch all categories
    if (category) {
      fetchCategory(category); // Fetch products for the initial category
    }
  }, [category]);

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
            {categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => handleNavigation(cat.id)}>
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Welcome to {getCategoryHeading()}!</h1>

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
