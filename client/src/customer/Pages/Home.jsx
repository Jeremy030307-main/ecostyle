import './Home.css';
import Product_1 from '../Components/Assets/Eo Root Round Next T-Shirt.png';
import Product_2 from '../Components/Assets/Eo Root Pullover Hoodie.png';
import Product_3 from '../Components/Assets/Eo Root Cargo Shorts.png';
import Product_4 from '../Components/Assets/Eo Root V-Neck Blouse.png';
import Product_5 from '../Components/Assets/Eo Root Long Sleeve Polo.png';
import search_icon from '../Components/Assets/search_icon.png';
import mega_sale_icon from '../Components/Assets/flash_sale_rectangle.png';
import { useNavigate } from 'react-router-dom';
import { getCategory } from '../../apiManager/methods/categoryMethods';
import { useEffect, useState } from 'react';



const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); 

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
  }, []);

  // Target date for Mega Sale: February 12, 2025
  const targetDate = new Date('February 12, 2025 00:00:00').getTime();

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const slides = [
    {
      title: 'Eo Root Round Next T-Shirt',
      description: 'A classic fit tee for everyday comfort and style',
      img: Product_1,
    },
    {
      title: 'Eo Root Pullover Hoodie',
      description: 'Warm and cozy hoodie for winter adventures',
      img: Product_2,
    },
    {
      title: 'Eo Root Cargo Shorts',
      description: 'Comfortable and durable shorts for outdoor adventures',
      img: Product_3,
    },
    {
      title: 'Eo Root V-Neck Blouse',
      description: 'A sleek V-neck blouse for effortless elegance',
      img: Product_4,
    },
    {
      title: 'Eo Root Long Sleeve Polo',
      description: 'A stylish all sesonal long sleeve polo',
      img: Product_5,
    },

  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // Function to update the countdown timer
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(timer);
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    // Automatically switch slides every 5 seconds
    const slideInterval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const handleNavigation = (category) => {
    navigate('/shop', { state: { category } });
  };

  const handleProductNavigation = (productId) => {
    navigate('/shop', { state: { productId } });
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
          {categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => handleNavigation(cat.id)}>{cat.name}</button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mega Sale Section */}
        <section className="flash-sale">
          <div className="showcase">
            <div className="content">
              <h1>{slides[activeSlide].title}</h1>
              <p className="banner-description">{slides[activeSlide].description}</p>
              <button className="shop-now" onClick={() => handleProductNavigation(slides[activeSlide].title)}>Shop Now →</button>
            </div>
            <img src={slides[activeSlide].img} className="banner-image" alt={slides[activeSlide].title} />
            <div className="indicators_separators"></div>
            <div className="indicators">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(index)}
                ></div>
              ))}
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
