import React from 'react'
import './Home.css';
import Product_1 from '../Components/Assets/Product_1.png'
import Product_2 from '../Components/Assets/Product_2.png'
import Product_3 from '../Components/Assets/Product_3.png'
import Product_4 from '../Components/Assets/Product_4.png'
import search_icon from '../Components/Assets/search_icon.png'
import flash_sale_icon from '../Components/Assets/flash_sale_rectangle.png'
// import add_to_fav_script from '../Components/Scripts/add_to_fav_button.js'

const Home = () => {
  return (
    <div class="container">
      {/* <!-- Sidebar --> */}
      <aside class="sidebar">
        <div class="search">
          <div class="search-wrapper">
            <img src={search_icon} class="search_icon" alt=""></img>
            <input type="text" placeholder="What are you looking for?"></input>
          </div>
        </div>
        <nav>
            <ul>
                <li><a href="#">Women's Fashion</a></li>
                <li><a href="#">Men's Fashion</a></li>
                <li><a href="#">Kids</a></li>
            </ul>
        </nav>
      </aside>

      {/* <!-- Main Content --> */}
      <main class="main-content">

          {/* <!-- Flash Sale Section --> */}
          <section class="flash-sale">
            <div class="showcase">
              <div class="content">
                <h1>Eco*Raincoat</h1>
                <p class="banner-description">Up to 10% off Voucher</p>
                <button class="shop-now">Shop Now →</button>
              </div>
              <img src={Product_4} class="product-image"></img>
              <div class="indicators_separators"></div>
              <div class="indicators">
                <div class="indicator"></div>
                <div class="indicator"></div>
                <div class="indicator active"></div>
                <div class="indicator"></div>
                <div class="indicator"></div>
              </div>
            </div>

              <div class="flash-sale-timer">
                <div class="flash-title">
                  <img src={flash_sale_icon}></img>
                  <span class="flash-label">Today's</span>
                </div>
              
                <div class="flash-timer">
                  <h1>Flash Sales</h1>
                    <div class="time-box">
                        <span class="time-value">03</span>
                        <span class="time-label">Days</span>
                    </div>
                    <span class="dot">:</span>
                    <div class="time-box">
                        <span class="time-value">23</span>
                        <span class="time-label">Hours</span>
                    </div>
                    <span class="dot">:</span>
                    <div class="time-box">
                        <span class="time-value">19</span>
                        <span class="time-label">Minutes</span>
                    </div>
                    <span class="dot">:</span>
                    <div class="time-box">
                        <span class="time-value">56</span>
                        <span class="time-label">Seconds</span>
                    </div>
                  </div>
              </div>

              {/* <!-- Sale Products -->/ */}
              <div class="product-grid">
                <div class="product-card">
                    <img src={Product_1} alt="Green Jacket"></img>
                    <span class="discount">-40%</span>
                    <button class="favorite-btn" aria-label="Add to favorites"  onlick="add_to_fav_script">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                </div>
                <div class="product-card">
                    <img src={Product_2} alt="Gray Hoodie"></img>
                    <span class="discount">-35%</span>
                    <button class="favorite-btn" aria-label="Add to favorites">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                </div>
                <div class="product-card">
                    <img src={Product_3} alt="Gray T-Shirt"></img>
                    <span class="discount">-30%</span>
                    <button class="favorite-btn" aria-label="Add to favorites">
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