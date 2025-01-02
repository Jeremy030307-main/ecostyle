import './Shop.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import search_icon from '../Components/Assets/search_icon.png';
import { useWishlist } from '../../WishlistContext'; // Access WishlistContext
import { getCategory } from '../../apiManager/methods/categoryMethods';
import ProductCard from '../Components/ProductCard'; // Import ProductCard

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCategory = location.state?.category || "MEN"; // Default category
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        // Replace with your product fetching logic
        const productData = await fetch(`/api/products?category=${category}`).then((res) =>
          res.json()
        );
        setProducts(productData);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleNavigation = (categoryId) => {
    setCategory(categoryId);
    navigate('/shop', { state: { category: categoryId } });
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="search">
          <div className="search-wrapper">
            <img src={search_icon} alt="Search" className="search_icon" />
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
        <h1>{categories.find((cat) => cat.id === category)?.name || 'Fashion'} Fashion</h1>

        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && products.length === 0 && <p>No products found for this category.</p>}

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} productId={product.id} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;