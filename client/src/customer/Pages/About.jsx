import React from 'react';
import './About.css';
import bannerImage from '../Components/Assets/form-bg.png'; // Example image
import team1 from '../Components/Assets/Product_1.png'; // Replace with actual team images
import team2 from '../Components/Assets/Product_2.png';
import team3 from '../Components/Assets/Product_3.png';
import deliveryIcon from '../Components/Assets/cart.svg'; // Example icons
import serviceIcon from '../Components/Assets/account.svg';
import guaranteeIcon from '../Components/Assets/wishlist.svg';

const About = () => {
  return (
    <>

      {/* Header Section */}
      <section className="about-header">
        <div className="about-text">
          <h1>Our Story</h1>
          <p>
            Launched in 2015, EcoStyle is South Asia's premier online shopping marketplace
            with an active presence in Bangladesh. Supported by wide-ranging solutions, 
            we serve millions of customers.
          </p>
          <p>
            EcoStyle offers over 1 million products, tailored marketing, and diverse 
            categories to meet your needs.
          </p>
        </div>
        <div className="about-image">
          <img src={bannerImage} alt="About Us" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="stat-card">
          <h3>10.5k</h3>
          <p>Sellers active on our site</p>
        </div>
        <div className="stat-card highlight">
          <h3>33k</h3>
          <p>Monthly Product Sale</p>
        </div>
        <div className="stat-card">
          <h3>45.5k</h3>
          <p>Customer active on our site</p>
        </div>
        <div className="stat-card">
          <h3>25k</h3>
          <p>Annual gross sale in our site</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="team-member">
          <img src={team1} alt="Tom Cruise" />
          <h4>Tom Cruise</h4>
          <p>Founder & Chairman</p>
        </div>
        <div className="team-member">
          <img src={team2} alt="Emma Watson" />
          <h4>Emma Watson</h4>
          <p>Managing Director</p>
        </div>
        <div className="team-member">
          <img src={team3} alt="Will Smith" />
          <h4>Will Smith</h4>
          <p>Product Designer</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="about-services">
        <div className="service">
          <img src={deliveryIcon} alt="Free Delivery" />
          <h4>FREE AND FAST DELIVERY</h4>
          <p>Free delivery for all orders over $140</p>
        </div>
        <div className="service">
          <img src={serviceIcon} alt="Customer Service" />
          <h4>24/7 CUSTOMER SERVICE</h4>
          <p>Friendly 24/7 customer support</p>
        </div>
        <div className="service">
          <img src={guaranteeIcon} alt="Money Back" />
          <h4>MONEY BACK GUARANTEE</h4>
          <p>We return money within 30 days</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="about-footer">
        <div className="footer-content">
          <div>
            <h3>Exclusive</h3>
            <p>Get 10% off your first order</p>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div>
            <h4>Support</h4>
            <p>111 Bijoy Sarani, Dhaka</p>
            <p>exclusive@gmail.com</p>
            <p>+88015-88888-9999</p>
          </div>
          <div>
            <h4>Quick Link</h4>
            <p>Privacy Policy</p>
            <p>Terms Of Use</p>
            <p>FAQ</p>
            <p>Contact</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default About;
