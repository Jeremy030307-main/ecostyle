import './Shop.css'; // Reuse the same CSS as Home.jsx
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
        {/* Blank space for now */}
        <h1>Welcome to the {category} Shop</h1>
        <p>The main content will go here in the future.</p>
      </main>
    </div>
  );
};

export default Shop;
