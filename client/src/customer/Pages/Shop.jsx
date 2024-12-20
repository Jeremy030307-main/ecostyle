import './Shop.css'; // Reuse the same CSS as Home.jsx
import Product_1 from '../Components/Assets/Product_1.png'
import Product_2 from '../Components/Assets/Product_2.png'
import Product_3 from '../Components/Assets/Product_3.png'
import { useLocation } from 'react-router-dom'; // To access the passed category
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the passed category from the state
  const category = location.state?.category || 'All Categories';

  const handleNavigation = (category) => {
    navigate('/shop', { state: { category } }); // Navigate within Shop if needed
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
        <h1>Welcome to the {category} Shop</h1>
        <p>The main content will go here in the future.</p>

        {/* Product Cards Section */}
        <div className="product-grid">
          <div className="product-card">
            <img src={Product_1} alt="Green Jacket" />
          </div>

          <div className="product-card">
            <img src={Product_2} alt="Gray Hoodie" />
          </div>

          <div className="product-card">
            <img src={Product_3} alt="Gray T-Shirt" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;
