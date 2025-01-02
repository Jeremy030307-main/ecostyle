import './Shop.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import search_icon from '../Components/Assets/search_icon.png';
import { getProduct, useProduct } from '../../apiManager/methods/productMethods';
import { getCategory } from '../../apiManager/methods/categoryMethods';
import { getProductReview } from '../../apiManager/methods/reviewMethods';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialCategory = location.state?.category || "MEN";
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({ size: false, color: false, category: false });
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);

  const sizes = ["S", "M", "L", "XL"];
  const colorNameMap = {
    "#000000": "Black",
    "#FFFFFF": "White",
    "#D9D9D9": "Gray",
    "#c3af91": "Khaki",
    "#F5F5DC": "Beige",
    "#283950": "Navy Blue",
    "#84b067": "Pistachio Green",
    "#545125": "Dark Khaki Green",
    "#EAD7DB": "Pink",
    "#7285A5": "Pigeon Blue",
    "#964B00": "Brown",
  };

  const productData = useProduct("", { category });

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
    if (category) {
      setProducts(productData || []);

      const uniqueColors = new Set();
      productData?.forEach((product) => {
        product.variant.forEach((variant) => {
          uniqueColors.add(variant.colorCode);
        });
      });
      setAvailableColors(Array.from(uniqueColors));
    }
  }, [category, productData]);

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsMap = {};
      if (productData) {
        await Promise.all(
          productData.map(async (product) => {
            try {
              const reviews = await getProductReview(product.id);
              const averageRating =
                reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
              ratingsMap[product.id] = {
                averageRating: averageRating.toFixed(1),
                reviewCount: reviews.length,
              };
            } catch (err) {
              console.error(`Error fetching reviews for product ${product.id}:`, err);
              ratingsMap[product.id] = { averageRating: "No rating", reviewCount: 0 };
            }
          })
        );
      }
      setRatings(ratingsMap);
    };

    fetchRatings();
  }, [productData]);

  const handleCategorySelection = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId); 
    setCategory(subCategoryId); 
  };

  const getSubcategories = () => {
    const selectedCategory = categories.find((cat) => cat.id === category);
    return selectedCategory?.subcategories || [];
  };

  const handleNavigation = (categoryId) => {
    setCategory(categoryId);
    navigate('/shop', { state: { category: categoryId } });
  };

  const handleProductClick = (product) => {
    navigate('/product', { state: { product } });
  };

  const getCategoryHeading = () => {
    const selectedCategory = categories.find((cat) => cat.id === category);
    return selectedCategory ? selectedCategory.name : " ";
  };

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
            {categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => handleNavigation(cat.id)}>{cat.name}</button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="filters">
          <h4>Filters</h4>

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

          <div className="filter-section">
            <button
              className="filter-toggle"
              onClick={() => setDropdownOpen((prev) => ({ ...prev, category: !prev.category }))}
            >
              Category
            </button>
            {dropdownOpen.category && (
              <ul className="filter-options">
                {/* Main Categories */}
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategorySelection(cat.id)}
                      className={cat.id === selectedSubCategory ? "selected" : ""}
                    >
                      {cat.name}
                    </button>
                    {/* Subcategories for the selected main category */}
                    {cat.id === selectedSubCategory && (
                      <ul className="subcategories">
                        {getSubcategories().map((subCat) => (
                          <li key={subCat.id}>
                            <button
                              onClick={() => handleCategorySelection(subCat.id)}
                              className={subCat.id === selectedSubCategory ? "selected" : ""}
                            >
                              {subCat.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="filter-section">
            <button
              className="filter-toggle"
              onClick={() => setDropdownOpen((prev) => ({ ...prev, color: !prev.color }))}
            >
              Color
            </button>
            {dropdownOpen.color && (
              <ul className="filter-options">
                {availableColors.map((colorHex) => (
                  <li key={colorHex}>
                    <button onClick={() => setSelectedColor(colorHex)}>
                      <span className="color-circle" style={{ backgroundColor: colorHex }}></span>
                      {colorNameMap[colorHex] || "Unknown Color"}
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
        {!loading && filteredProducts.length === 0 && <p>Loading Products.</p>}

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
                <span className="stars">⭐ {ratings[product.id]?.averageRating || 'No rating'}</span>
                <span className="review-count">({ratings[product.id]?.reviewCount || 0} reviews)</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;