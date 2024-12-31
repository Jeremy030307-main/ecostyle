import './Home.css';
import search_icon from '../Components/Assets/search_icon.png';
import mega_sale_icon from '../Components/Assets/flash_sale_rectangle.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const targetDate = new Date('February 12, 2025 00:00:00').getTime();

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  // Fetch Product Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/products'); // Replace with actual API endpoint
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Countdown Timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });

      if (distance < 0) clearInterval(timer);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [targetDate]);

  // Auto-switch slides
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [products.length]);

  const handleNavigateToProduct = (product) => {
    navigate('/product', { state: { product } });
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
            <li><button onClick={() => navigate('/shop', { state: { category: 'WMN' } })}>Women's Fashion</button></li>
            <li><button onClick={() => navigate('/shop', { state: { category: 'MEN' } })}>Men's Fashion</button></li>
            <li><button onClick={() => navigate('/shop', { state: { category: 'KIDS' } })}>Kids</button></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Flash Sale Section */}
        <section className="flash-sale">
          {products.length > 0 && (
            <div className="showcase">
              <div className="content">
                <h1>{products[activeSlide].name}</h1>
                <p className="banner-description">{products[activeSlide].description}</p>
                <button
                  className="shop-now"
                  onClick={() => handleNavigateToProduct(products[activeSlide])}
                >
                  Shop Now →
                </button>
              </div>
              <img
                src={products[activeSlide].thumbnail}
                className="product-image"
                alt={products[activeSlide].name}
              />
              <div className="indicators">
                {products.map((_, index) => (
                  <div
                    key={index}
                    className={`indicator ${index === activeSlide ? 'active' : ''}`}
                    onClick={() => setActiveSlide(index)}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div className="flash-sale-timer">
            <div className="flash-title">
              <img src={mega_sale_icon} alt="Mega Sale Icon" />
              <span className="flash-label">Mega Sale</span>
            </div>
            <div className="flash-timer">
              {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
