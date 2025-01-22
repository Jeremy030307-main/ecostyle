import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "./About.css";
import bannerImage from "../Components/Assets/figma_image_1.jpeg";
import team1 from "../Components/Assets/old_ceo.jpeg";
import team2 from "../Components/Assets/female_ceo.jpeg";
import team3 from "../Components/Assets/new_ceo.jpeg";
import team4 from "../Components/Assets/ceo1.png";
import team5 from "../Components/Assets/ceo2.png";
import team6 from "../Components/Assets/ceo3.png";
import deliveryIcon from "../Components/Assets/cart.svg";
import serviceIcon from "../Components/Assets/account.svg";
import guaranteeIcon from "../Components/Assets/wishlist.svg";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const teamMembers = [
  { id: 1, name: "Hanshika", role: "RTE", image: team5, twitter: "https://twitter.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
  { id: 2, name: "Nallya", role: "RTE", image: team2, twitter: "https://twitter.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
  { id: 3, name: "Benjamin Tan En Zhe", role: "Product", image: team3, twitter: "https://twitter.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
  { id: 4, name: "Bryan Hii Neng Yuan", role: "Marketing Head", image: team4, twitter: "https://twitter.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
  { id: 5, name: "Foo Jia Wei", role: "HR Manager", image: team3, twitter: "https://twitter.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
  { id: 6, name: "Benjamin Tan En Zhe", role: "Sales Lead", image: team1, twitter: "https://twitter.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
  { id: 7, name: "Shivansh", role: "Sales Lead", image: team6, twitter: "https://twitter.com/shivansh", instagram: "https://instagram.com", linkedin: "https://linkedin.com" },
];

const stats = [
  { id: 1, value: "10.5k", description: "Sellers active on our site" },
  { id: 2, value: "33k", description: "Monthly Product Sale" },
  { id: 3, value: "45.5k", description: "Customers active on our site" },
  { id: 4, value: "25k", description: "Annual gross sale" },
];

const About = () => {
  const [activeCard, setActiveCard] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-text">
          <h1>Discover Our Journey</h1>
          <p>
            Established in 2024, EcoStyle is Malaysia's foremost sustainable
            fashion marketplace. Our mission is to inspire eco-conscious living
            by offering chic, eco-friendly apparel while promoting sustainable
            practices.
          </p>
          <p>
            Join us in revolutionizing fashion by making choices that are both
            stylish and sustainable for the planet.
          </p>
          <button className="cta-button"><Link to="/shop" style={{ textDecoration: 'none', color: 'white' }}>Checkout Here</Link></button>
        </div>
        <div className="hero-image">
          <img src={bannerImage} alt="Our Journey" />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="about-stats">
        <h2 className="section-title">Our Impact</h2>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`stat-card ${activeCard === stat.id ? "active" : ""}`}
              onClick={() => setActiveCard(stat.id)}
            >
              <h3>{stat.value}</h3>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2 className="section-title">Meet the Team</h2>
        <Slider {...settings}>
          {teamMembers.map((member) => (
            <div key={member.id} className="team-member">
              <img src={member.image} alt={member.name} />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
              <div className="team-socials">
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Services Section */}
      <section className="about-services">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="services-grid">
          <div className="service">
            <img src={deliveryIcon} alt="Free Delivery" />
            <h4>Free & Fast Delivery</h4>
            <p>Enjoy free delivery on orders over $140.</p>
          </div>
          <div className="service">
            <img src={serviceIcon} alt="Customer Service" />
            <h4>24/7 Customer Support</h4>
            <p>We’re here for you round the clock.</p>
          </div>
          <div className="service">
            <img src={guaranteeIcon} alt="Money Back" />
            <h4>Money Back Guarantee</h4>
            <p>Receive a full refund within 30 days.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;