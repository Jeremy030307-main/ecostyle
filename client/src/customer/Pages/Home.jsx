import './Home.css';
import Product_1 from '../Components/Assets/Product_1.png';
import Product_2 from '../Components/Assets/Product_2.png';
import Product_3 from '../Components/Assets/Product_3.png';
import Product_4 from '../Components/Assets/Product_4.png';
import search_icon from '../Components/Assets/search_icon.png';
import mega_sale_icon from '../Components/Assets/flash_sale_rectangle.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();

  // Target date for Mega Sale: February 12, 2025
  const targetDate = new Date('February 12, 2025 00:00:00').getTime();

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Function to update the countdown timer
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      // Time calculations for days, hours, minutes, and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });

      // If the countdown ends, stop the timer
      if (distance < 0) {
        clearInterval(timer);
      }
    };

    // Update timer every second
    const timer = setInterval(updateTimer, 1000);

    // Initialize the timer
    updateTimer();

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, [targetDate]);

  const handleNavigation = (category) => {
    navigate('/shop', { state: { category } }); // Pass category data to Shop page
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="search">
          <div className="search-wrapper">
            <img src={search_icon} className="search_icon" alt="Search Icon" />
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

      {/* Main Content */}
      <main className="main-content">
        {/* Mega Sale Section */}
        <section className="flash-sale">
          <div className="showcase">
            <div className="content">
              <h1>Eco*Raincoat</h1>
              <p className="banner-description">Up to 10% off Voucher</p>
              <button className="shop-now">Shop Now →</button>
            </div>
            <img src={Product_4} className="product-image" alt="Eco Raincoat" />
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
              <img src={mega_sale_icon} alt="Mega Sale Icon" />
              <span className="flash-label">Mega Sale</span>
            </div>

            <div className="flash-timer">
              <h1>Mega Sale Countdown</h1>
              <div className="time-box">
                <span className="time-value">{timeRemaining.days}</span>
                <span className="time-label">Days</span>
              </div>
              <span className="dot">:</span>
              <div className="time-box">
                <span className="time-value">{timeRemaining.hours}</span>
                <span className="time-label">Hours</span>
              </div>
              <span className="dot">:</span>
              <div className="time-box">
                <span className="time-value">{timeRemaining.minutes}</span>
                <span className="time-label">Minutes</span>
              </div>
              <span className="dot">:</span>
              <div className="time-box">
                <span className="time-value">{timeRemaining.seconds}</span>
                <span className="time-label">Seconds</span>
              </div>
            </div>
          </div>

          {/* Sale Products */}
          <div className="product-grid">
            <div className="product-card">
              <img src={Product_1} alt="Green Jacket" />
              <span className="discount">-40%</span>
              <button className="favorite-btn" aria-label="Add to favorites">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
            <div className="product-card">
              <img src={Product_2} alt="Gray Hoodie" />
              <span className="discount">-35%</span>
              <button className="favorite-btn" aria-label="Add to favorites">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
            <div className="product-card">
              <img src={Product_3} alt="Gray T-Shirt" />
              <span className="discount">-30%</span>
              <button className="favorite-btn" aria-label="Add to favorites">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
