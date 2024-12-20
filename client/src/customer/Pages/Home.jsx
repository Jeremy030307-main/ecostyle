import './Home.css';
import Product_1 from '../Components/Assets/Product_1.png'
import Product_2 from '../Components/Assets/Product_2.png'
import Product_3 from '../Components/Assets/Product_3.png'
import Product_4 from '../Components/Assets/Product_4.png'
import search_icon from '../Components/Assets/search_icon.png'
import flash_sale_icon from '../Components/Assets/flash_sale_rectangle.png'
import { useState, useEffect } from 'react';
import { addProduct, addSize, addVariant, deleteProduct, deleteSize, deleteVariant, getProduct, updateProduct, updateVariant } from '../../apiManager/methods/productMethods';
import { useNavigate } from 'react-router-dom'; 
// import add_to_fav_script from '../Components/Scripts/add_to_fav_button.js'

const Home = () => {

    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    const handleNavigation = (category) => {
      navigate('/shop', { state: { category } }); // Pass category data to Shop page
    };
    useEffect(() => {
        const fetchCategory = async () => {
            try {
              await deleteSize("ES00002", "2XL") 
              // console.log(data)
                
            } catch (err) {
                setError(err.message); // Handle error
                console.error(err);
            } finally {
                setLoading(false); // Stop loading when request is done
            }
        };

        fetchCategory(); // Fetch data when component mounts or categoryID changes
    }, []); // Dependency array: only rerun if categoryID changes

  return (
    <div className="container">
      {/* <!-- Sidebar --> */}
      <aside className="sidebar">
        <div className="search">
          <div className="search-wrapper">
            <img src={search_icon} className="search_icon" alt=""></img>
            <input type="text" placeholder="What are you looking for?"></input>
          </div>
        </div>
        <nav>
            <ul>
                <li>
                  <button onClick={() => handleNavigation("Women's Fashion")}>Women's Fashion</button>
                </li>
                <li>
                <button onClick={() => handleNavigation("Men's Fashion")}>Men's Fashion</button>
                </li>
                <li>
                <button onClick={() => handleNavigation("Kids")}>Kids</button>
                </li>
            </ul>
        </nav>
      </aside>

      {/* <!-- Main Content --> */}
      <main className="main-content">

          {/* <!-- Flash Sale Section --> */}
          <section className="flash-sale">
            <div className="showcase">
              <div className="content">
                <h1>Eco*Raincoat</h1>
                <p className="banner-description">Up to 10% off Voucher</p>
                <button className="shop-now">Shop Now →</button>
              </div>
              <img src={Product_4} className="product-image"></img>
              <div className="indicators_separators"></div>
              <div className="indicators">
                <div className="indicator"></div>
                <div className="indicator"></div>
                <div className="indicator active"></div>
                <div className="indicator"></div>
                <div className="indicator"></div>
              </div>
            </div>

              <div className="flash-sale-timer">
                <div className="flash-title">
                  <img src={flash_sale_icon}></img>
                  <span className="flash-label">Today's</span>
                </div>
              
                <div className="flash-timer">
                  <h1>Flash Sales</h1>
                    <div className="time-box">
                        <span className="time-value">03</span>
                        <span className="time-label">Days</span>
                    </div>
                    <span className="dot">:</span>
                    <div className="time-box">
                        <span className="time-value">23</span>
                        <span className="time-label">Hours</span>
                    </div>
                    <span className="dot">:</span>
                    <div className="time-box">
                        <span className="time-value">19</span>
                        <span className="time-label">Minutes</span>
                    </div>
                    <span className="dot">:</span>
                    <div className="time-box">
                        <span className="time-value">56</span>
                        <span className="time-label">Seconds</span>
                    </div>
                  </div>
              </div>

              {/* <!-- Sale Products -->/ */}
              <div className="product-grid">
                <div className="product-card">
                    <img src={Product_1} alt="Green Jacket"></img>
                    <span className="discount">-40%</span>
                    <button className="favorite-btn" aria-label="Add to favorites"> {/*}onClick={add_to_fav_script}*/}
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                </div>
                <div className="product-card">
                    <img src={Product_2} alt="Gray Hoodie"></img>
                    <span className="discount">-35%</span>
                    <button className="favorite-btn" aria-label="Add to favorites">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                </div>
                <div className="product-card">
                    <img src={Product_3} alt="Gray T-Shirt"></img>
                    <span className="discount">-30%</span>
                    <button className="favorite-btn" aria-label="Add to favorites">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                </div>
            </div>
          </section>
      </main>
    </div>
  )
}

export default Home