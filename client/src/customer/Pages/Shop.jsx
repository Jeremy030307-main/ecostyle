import './Shop.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import search_icon from '../Components/Assets/search_icon.png';
import { getProduct, useProduct } from '../../apiManager/methods/productMethods';
import { getCategory } from '../../apiManager/methods/categoryMethods';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCategory = location.state?.category || "MEN"; // Default to Men's category
  const [categories, setCategories] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [category, setCategory] = useState(initialCategory); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const colors = ["#000000", "#FFFFFF", "#D9D9D9", "#c3af91", "#F5F5DC", "#283950", "#84b067", "#545125", "#EAD7DB"];
  const sizes = ["S", "M", "L", "XL"];
  const colorMap = {
    "#000000": "Black", 
    "#FFFFFF": "White", 
    "#F5F5DC": "Beige", 
    "#EAD7DB": "Pink", 
    "#283950": "Navy Blue", 
    "#84b067": "Pistachio Green", 
    "#545125": "Dark Khaki Green", 
    "#D9D9D9": "Gray", 
    "#c3af91": "Khaki", 
  };
  
  

<<<<<<< HEAD
  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch products for a selected category
  const fetchCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError('');
      const data = await getProduct("", { category: categoryId });
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
=======
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
>>>>>>> fba0a1779c38d2617dc7dfc64f90e802874c707e
    }
  }, [category, productData]);

  // Handle navigation to shop with a selected category
  const handleNavigation = (categoryId) => {
<<<<<<< HEAD
    setCategory(categoryId);
    setSelectedSize(null); // Reset size filter
    setSelectedColor(null); // Reset color filter
    navigate('/shop', { state: { category: categoryId } });
    fetchCategory(categoryId);
  };

  // Fetch categories and initial products on component mount
  useEffect(() => {
    fetchCategories();
    if (category) {
      fetchCategory(category);
    }
  }, [category]);

  

=======
    setCategory(categoryId); // Update selected category ID
    navigate('/shop', { state: { category: categoryId } }); // Navigate with category state
    // fetchCategory(categoryId); // Fetch products for the selected category
  };

>>>>>>> fba0a1779c38d2617dc7dfc64f90e802874c707e
  const handleProductClick = (product) => {
    navigate('/product', { state: { product } });
  };

  const getCategoryHeading = () => {
    const selectedCategory = categories.find((cat) => cat.id === category);
    return selectedCategory ? selectedCategory.name : " "; 
    };

  // Filter products based on selected size and color
  const filteredProducts = products.filter((product) => {
    const matchesSize = selectedSize ? product.size.includes(selectedSize) : true;
    const matchesColor = selectedColor
      ? product.variant.some((variant) => variant.colorCode === selectedColor)
      : true;
    return matchesSize && matchesColor;
  });

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
        <div className="filters">
          <h4>Filters</h4>

          {/* Size Filter */}
          <div className="filter-section">
            <button
              className="filter-toggle"
              onClick={() => setDropdownOpen((prev) => ({ ...prev, size: !prev.size }))}
            >
              Size
            </button>
            {dropdownOpen.size && (
              <ul className="filter-options">
                {sizes.map((size) => (
                  <li key={size}>
                    <button onClick={() => setSelectedSize(size)}>{size}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Color Filter */}
          <div className="filter-section">
            <button
              className="filter-toggle"
              onClick={() => setDropdownOpen((prev) => ({ ...prev, color: !prev.color }))}
            >
              Color
            </button>
            {dropdownOpen.color && (
              <ul className="filter-options">
                {Object.entries(colorMap).map(([colorHex, colorName]) => (
                  <li key={colorHex}>
                    <button onClick={() => setSelectedColor(colorHex)}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          backgroundColor: colorHex,
                          borderRadius: "50%",
                          marginRight: "10px",
                          border: "1px solid #ccc",
                        }}
                      ></span>
                      {colorName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <h1>{getCategoryHeading()} Fashion</h1>

        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && filteredProducts.length === 0 && <p>No products found for this category.</p>}

        <div className="product-grid">
          {filteredProducts.map((product) => (
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