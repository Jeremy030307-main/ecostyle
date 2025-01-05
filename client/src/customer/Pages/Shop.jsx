import "./Shop.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import search_icon from "../Components/Assets/search_icon.png";
import {
  getProduct,
  useProduct,
} from "../../apiManager/methods/productMethods";
import { getCategory } from "../../apiManager/methods/categoryMethods";

// Recursive component to render categories and subcategories

const CategoryMenu = ({ categories, level = 0, selectedCategory, setSelectedCategory }) => {
  const [isExpanded, setIsExpanded] = useState({});

  const handleCategoryClick = (id) => {
    console.log(selectedCategory, id)
    if (selectedCategory === id) {
      setIsExpanded((prev) => ({ ...prev, [id]: false }));
      if (id.includes("_")) {
        const parentID = id.substring(0, id.lastIndexOf('_'));
        setSelectedCategory(parentID);
      } else {
        setSelectedCategory(null);
      }
    } else {
      setSelectedCategory(id);
      setIsExpanded((prev) => ({ ...prev, [id]: true }));
    }
  };

  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id}>
          <div
            style={{
              paddingLeft: `${level * 20}px`,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: selectedCategory && selectedCategory.startsWith(category.id) ? 'bold' : 'normal',
              color: selectedCategory && selectedCategory.startsWith(category.id) ? '#17A375' : 'black',
            }}
            onClick={() => {
              handleCategoryClick(category.id);
            }}
            className="category-individual-container"
          >
            <span>{category.name}</span>
            {/* Icon based on expanded/collapsed state */}
            {category.subcategories && category.subcategories.length > 0 && (
              <i
                className={`fa-solid ${
                  isExpanded[category.id] ? 'fa-chevron-up fa-flip-both' : 'fa-chevron-right'
                }`}
                style={{ marginLeft: '10px' }}
              ></i>
            )}
          </div>

          {/* Animate the subcategories */}
          {category.subcategories &&
            category.subcategories.length > 0 &&
            isExpanded[category.id] && (
              <div
                className="category-subcategories-container expanded"
                style={{ transition: 'all 0.3s ease-in-out', overflow: 'hidden' }}
              >
                <CategoryMenu
                  categories={category.subcategories}
                  level={level + 1}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            )}
        </li>
      ))}
    </ul>
  );
};

const Dropdown = ({ title, children }) => {

  const [expand, setExpand] = useState(false)

  return (
    <div className="dropdown-container">
      <div className="shop-sidebase-dropdown-header">
        <h3>{title}</h3>

        {expand ? (
          <i class="fa-solid fa-chevron-up" onClick={() => setExpand(false)}></i>
        ): (
          <i class="fa-solid fa-chevron-up fa-flip-both" onClick={() => setExpand(true)}></i>
        )}
      </div>
      <hr />
        <div className="dropdown-content"
        style={{display: expand ? "block" : "none"}}>
          {children} {/* Render the passed-in component or JSX here */}
        </div>
    </div>
  );
};

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const [availableColors, setAvailableColors] = useState([]);

  const [categoryProduct, setCategoryProduct] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([]);

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
    setCategories([
      {
        id: "MEN",
        name: "Men",
        subcategories: [
          {
            id: "MEN_BOT",
            name: "Bottoms",
            subcategories: [
              { id: "MEN_BOT_HS", name: "Pants" },
              { id: "MEN_BOT_PL", name: "Shorts" }
            ]
          },
          { id: "MEN_TOP", name: "Tops", subcategories: [] }
        ]
      },
      {
        id: "WMN",
        name: "Women",
        subcategories: [
          {
            id: "WMN_BOT",
            name: "Bottoms",
            subcategories: [
              { id: "WMN_BOT_HS", name: "Pants" },
              { id: "WMN_BOT_SK", name: "Skirts" }
            ]
          },
          { id: "WMN_DRS", name: "Dresses", subcategories: [] },
          { id: "WMN_TOP", name: "Tops", subcategories: [] }
        ]
      }
    ])
  }, [])

  // Fetch category
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

  // Compute available color of the product data
  useEffect(() => {
    const uniqueColorsMap = new Map();

    productData?.forEach((product) => {
      product.variant.forEach((variant) => {
        // Create a unique key using both the id and colorCode
        const key = `${variant.id}_${variant.colorCode}`;
        // Only add if the key doesn't already exist in the Map
        if (!uniqueColorsMap.has(key)) {
          uniqueColorsMap.set(key, { id: variant.id, code: variant.colorCode });
        }
      });
    });
    
    // Convert the Map values into an array (if needed)
    const uniqueColors = Array.from(uniqueColorsMap.values());
    setAvailableColors(Array.from(uniqueColors));
    setCategoryProduct(productData)
  }, [productData]);

  useEffect(() => {
    if (selectedColor && categoryProduct) {
      // Filter the products based on the selectedColor in the color array
      const filtered = categoryProduct.filter((product) =>
        product.color.includes(selectedColor)  // Check if selectedColor is in the color array
      );
      setFilteredProducts(filtered);
    } else {
      // If no color is selected, display all products
      setFilteredProducts(categoryProduct);
    }
  }, [selectedColor, categoryProduct]);

  useEffect(() => {
    if (selectedSize && categoryProduct) {
      // Filter the products based on the selectedColor in the color array
      const filtered = categoryProduct.filter((product) =>
        product.size.includes(selectedSize)  // Check if selectedColor is in the color array
      );
      setFilteredProducts(filtered);
    } else {
      // If no color is selected, display all products
      setFilteredProducts(categoryProduct);
    }

  }, [selectedSize, categoryProduct])


  const handleProductClick = (productID) => {
    navigate(`/product/${productID}`);
  };

  const getCategoryHeading = () => {
    const selectedCategory = categories.find((cat) => cat.id === category);
    return selectedCategory ? selectedCategory.name : " ";
  };


  return (
    <div className="shop-container">
      <aside className="shop-sidebar">
        
        <div className="search">
          <div className="search-wrapper">
            <img src={search_icon} className="search_icon" alt="" />
            <input type="text" placeholder="Whatchu looking for?" />
          </div>
        </div>

        <Dropdown title={"Category"}>
          <ul className="filter-options">
            <CategoryMenu categories={categories} selectedCategory={category} setSelectedCategory={setCategory} />
          </ul>
        </Dropdown>

        <Dropdown title={"Size"}>
          <ul className="filter-options">
            {categoryProduct ? (sizes.map((size) => {
              const count = categoryProduct.filter((product) =>
                product.size.includes(size)
              ).length;
              return (
                <li key={size}>
                  <button onClick={() => setSelectedSize(size)}>
                    {size} ({count})
                  </button>
                </li>
              );
            })) : (
              <></>
            )}
          </ul>
        </Dropdown>
            
        <Dropdown title={"Color"}>
        <ul className="filter-options">
          {Array.isArray(availableColors) && Array.isArray(categoryProduct) ? (
            availableColors.map((color) => {
              // Safely checking productData to avoid errors
              const count = categoryProduct.filter((product) =>
                product.variant?.some(
                  (variant) => variant.colorCode === color.code
                )
              ).length;
        
              return (
                <li key={color.code}>
                  <button onClick={() => setSelectedColor(color.id)}>
                    <span
                      className="color-circle"
                      style={{ backgroundColor: color.code }}
                    ></span>
                    {colorNameMap[color.code] || "Unknown Color"} ({count})
                  </button>
                </li>
              );
            })
          ) : (
            <li>No colors available or product data is missing.</li>
          )}
        </ul>
        </Dropdown>
      </aside>


      <main className="shop-main-content">
        <h1>{getCategoryHeading()} Fashion</h1>
        <p className="product-count">{filteredProducts ? filteredProducts.length : 0} items</p>

        <div className="shop-product-grid">
          {filteredProducts && filteredProducts.map((product) => (
            <button
              key={product.id}
              className="shop-product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={product.variant[0]?.image || "/placeholder.png"}
                alt={product.name}
                className="shop-product-image"
              />
              <h3 className="shop-product-name">{product.name}</h3>
              <p className="shop-product-price">${product.price.toFixed(2)}</p>
              <div className="shop-color-swatches">
                {product.variant.map((variant) => (
                  <div
                    key={variant.id}
                    className="shop-color-swatch"
                    style={{ backgroundColor: variant.colorCode }}
                    title={variant.name}
                  />
                ))}
              </div>
              <div className="shop-rating">
                <span className="shop-stars">
                  ⭐ {product.rating || "No rating"}
                </span>
                <span className="shop-review-count">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
