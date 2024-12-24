import React from 'react';
import './About.css';
import aboutImage from '../Components/Assets/aboutImage.png';

const About = () => {
  return (
    <div className="about-container">
      {/* Our Story Section */}
      <div className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Launched in 2015, Exclusive is South Asia’s premier online shopping
            marketplace with an active presence in Bangladesh. Supported by wide
            range of tailored marketing, data and service solutions, Exclusive
            has 10,500 sellers and 300 brands and serves 3 million customers
            across the region.
          </p>
          <p>
            Exclusive has more than 1 million products to offer, growing at a
            very fast. Exclusive offers a diverse assortment in categories
            ranging from consumer.
          </p>
        </div>
        <div className="about-image">
          <img src={aboutImage} alt="Our Story" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="about-stats">
        <div className="stat-box">
          <div className="stat-value">10.5k</div>
          <div className="stat-label">Sellers active on our site</div>
        </div>
        <div className="stat-box highlighted">
          <div className="stat-value">33k</div>
          <div className="stat-label">Monthly Product Sale</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">45.5k</div>
          <div className="stat-label">Customers active on our site</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">25k</div>
          <div className="stat-label">Annual gross sale on our site</div>
        </div>
      </div>

      {/* Team Section */}
      <div className="about-team">
        <div className="team-member">
          <img src="person1.png" alt="Tom Cruise" />
          <h3>Tom Cruise</h3>
          <p>Founder & Chairman</p>
          <div className="social-links">
            <i className="icon-instagram"></i>
            <i className="icon-linkedin"></i>
          </div>
        </div>

        <div className="team-member">
          <img src="person2.png" alt="Emma Watson" />
          <h3>Emma Watson</h3>
          <p>Managing Director</p>
          <div className="social-links">
            <i className="icon-instagram"></i>
            <i className="icon-linkedin"></i>
          </div>
        </div>

        <div className="team-member">
          <img src="person3.png" alt="Will Smith" />
          <h3>Will Smith</h3>
          <p>Product Designer</p>
          <div className="social-links">
            <i className="icon-instagram"></i>
            <i className="icon-linkedin"></i>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="about-services">
        <div className="service-item">
          <h4>FREE AND FAST DELIVERY</h4>
          <p>Free delivery for all orders over $140</p>
        </div>
        <div className="service-item">
          <h4>24/7 CUSTOMER SERVICE</h4>
          <p>Friendly 24/7 customer support</p>
        </div>
        <div className="service-item">
          <h4>MONEY BACK GUARANTEE</h4>
          <p>We return money within 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default About;