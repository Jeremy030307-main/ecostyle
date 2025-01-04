import React from "react";
import Navbar from '../Components/Navbar/Navbar'
import { ArrowRight, Leaf, Droplet, Wind } from "lucide-react";
import "./HomePage.css";
import Heroimage from '../Components/Assets/home_page.png'
import Mencategory from '../Components/Assets/men_category.png'
import Womencategory from '../Components/Assets/women_category.png'
import Footerimage from '../Components/Assets/Footer.png'
import { Link } from "react-router-dom";

const HomePage = () => {
  // Environmental impact data
  const impactMetrics = {
    plasticRecycled: "2.5M",
    energySaved: "1.2M",
    carbonOffset: "500K",
  };

  const categories = [
    {
      title: "Men's Collection",
      description: "Sustainable style for the modern man",
      image: Mencategory,
    },
    {
      title: "Women's Collection",
      description: "Eco-conscious fashion that makes a statement",
      image: Womencategory,
    },
  ];

  return (
    <div className="homepage">

      {/* Hero Section */}
      <div className="hero">
        <img
          src={Heroimage}
          alt="Sustainable Fashion"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Fashion that Respects Our Planet</h1>
          <p>
            Every piece tells a story of sustainability, crafted from recycled
            materials with love for our environment.
          </p>
          <Link className="homepage-link" to={"/shop"}>
            <button className="cta-button">
              Shop Now <ArrowRight size={20} />
            </button>
          </Link>
          
        </div>
      </div>

      {/* Impact Metrics Section */}
      <div className="impact-section">
        <h2>Our Environmental Impact</h2>
        <div className="impact-grid">
          <div className="impact-card">
            <Droplet className="impact-icon blue" size={40} />
            <h3>{impactMetrics.plasticRecycled}</h3>
            <p>Plastic Bottles Recycled</p>
          </div>
          <div className="impact-card">
            <Wind className="impact-icon green" size={40} />
            <h3>{impactMetrics.energySaved}</h3>
            <p>kWh Energy Saved</p>
          </div>
          <div className="impact-card">
            <Leaf className="impact-icon dark-green" size={40} />
            <h3>{impactMetrics.carbonOffset}</h3>
            <p>kg CO2 Offset</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2>Shop Sustainable</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <img
                src={category.image}
                alt={category.title}
                className="category-image"
              />
              <div className="category-content">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <Link className="homepage-link" to={"/shop"}>
                <button className="category-button">
                  Shop Now <ArrowRight size={16} />
                </button>
                </Link>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Commitment Section */}
      <div className="commitment-section">
        <div className="commitment-container">
          <div className="commitment-image">
            <img src={Footerimage} alt="Our Commitment" />
          </div>
          <div className="commitment-content">
            <h2>Our Commitment to Earth</h2>
            <p>
              Every garment we create is a step towards a more sustainable
              future. We use only recycled materials, implement zero-waste
              manufacturing processes, and ensure fair labor practices
              throughout our supply chain.
            </p>
            <Link className="homepage-link" to={"/about"}>
            <button className="cta-button">
              Learn More <ArrowRight size={20} />
            </button>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
