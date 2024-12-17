import React from 'react';
import './About.css';
import aboutImage from '../Assets/aboutImage.png';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Launched in 2015, EcoStyle is South Asia’s premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data, and service solutions, EcoStyle has 10,500 sellers and 300 brands and serves 3 million customers across the region.
          </p>
          <p>
            EcoStyle has more than 1 million products to offer, growing at a rapid pace with a diverse assortment in categories ranging from consumer goods to fashion.
          </p>
        </div>
        <div className="about-image">
          <img src={aboutImage} alt="About EcoStyle" />
        </div>
      </div>
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
      <div className="about-team">
        <div className="team-member">
          <img src="person.png" alt="Team member" />
          <div className="team-member-name">John Doe</div>
          <div className="team-member-role">CEO</div>
        </div>
        <div className="team-member">
          <img src="person.png" alt="Team member" />
          <div className="team-member-name">Jane Smith</div>
          <div className="team-member-role">Marketing Head</div>
        </div>
        <div className="team-member">
          <img src="person.png" alt="Team member" />
          <div className="team-member-name">Mike Johnson</div>
          <div className="team-member-role">Sales Manager</div>
        </div>
      </div>
    </div>
  );
};

export default About;
