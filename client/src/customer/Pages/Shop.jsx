import './Shop.css'; // Reuse the same CSS as Home.jsx
import { useLocation } from 'react-router-dom'; // To access the passed category
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProduct } from '../../apiManager/methods/productMethods'; // Import the API call

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Default category is set to 'Women's Fashion' if no category is passed
  const initialCategory = location.state?.category || "Women's Fashion";
  const [category, setCategory] = useState(initialCategory);

  // State to store products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // State for handling errors

  // Function to fetch products based on the category
  const fetchCategory = async (category) => {
    try {
      setLoading(true); // Start loading
      setError(''); // Clear previous errors
      console.log(`Fetching products for category: ${category}`);

      // Fetch products for the selected category
      const data = await getProduct("", { category });
      setProducts(data || []); // Assuming `data` is the product array
    } catch (err) {
      setError(err.message); // Handle error
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Use useEffect to fetch products when category changes
  useEffect(() => {
    fetchCategory(category); // Fetch products whenever category changes
  }, [category]); // Dependency array includes category

  // Function to handle navigation and change category
  const handleNavigation = (category) => {
    setCategory(category); // Update category state
    navigate('/shop', { state: { category } }); // Navigate with the selected category
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="search">
          <div className="search-wrapper">
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

      {/* Main Content */}
      <main className="main-content">
        <h1>Welcome to {category}!</h1>

        {/* Loading State */}
        {loading && <p>Loading products...</p>}

        {/* Error Handling */}
        {error && <p className="error">{error}</p>}

        {/* Product Cards Section */}
        {!loading && products.length === 0 && <p>No products found.</p>}

        <div className="product-grid">
          {products?.length > 0 && products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.thumbnail || '/placeholder.png'} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
