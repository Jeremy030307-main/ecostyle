import React, { useState, useEffect } from "react";
import Slider  from "react-slick";
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



const teamMembers = [
  { id: 1, name: "Tom Cruise", role: "Founder & Chairman", image: team1 },
  { id: 2, name: "Emma Watson", role: "Managing Director", image: team2 },
  { id: 3, name: "Will Smith", role: "Product Designer", image: team3 },
  { id: 4, name: "Robert Downey", role: "Marketing Head", image: team4 },
  { id: 5, name: "Scarlett Johansson", role: "HR Manager", image: team5 },
  { id: 6, name: "Chris Evans", role: "Sales Lead", image: team6 },
];

const About = () => {
  const [activeCard, setActiveCard] = useState(null);

  const stats = [
    { id: 1, value: "10.5k", description: "Sellers active on our site" },
    { id: 2, value: "33k", description: "Monthly Product Sale" },
    { id: 3, value: "45.5k", description: "Customers active on our site" },
    { id: 4, value: "25k", description: "Annual gross sale" },
  ];

  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop the slides
    speed: 500, // Transition speed
    slidesToShow: 3, // Number of slides to show at a time
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Auto-scroll the slider
    autoplaySpeed: 10000, // Rotate every 10 seconds
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  

  return (
    <>
      {/* Header Section */}
      <section className="about-header">
        <div className="about-text">
          <h1>Our Story</h1>
          <p>
            Launched in 2015, EcoStyle is South Asia's premier online shopping
            marketplace with an active presence in Bangladesh. Supported by
            wide-ranging solutions, we serve millions of customers.
          </p>
          <p>
            EcoStyle offers over 1 million products, tailored marketing, and
            diverse categories to meet your needs.
          </p>
        </div>
        <div className="about-image">
          <img src={bannerImage} alt="About Us" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
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
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2 className="section-title">Meet Our Team</h2>
        <Slider {...settings}>
          {teamMembers.map((member) => (
            <div key={member.id} className="team-member">
              <img src={member.image} alt={member.name} />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
              <div className="team-socials">
                <span>🐦</span> <span>📷</span> <span>🔗</span>
              </div>
            </div>
          ))}
        </Slider>
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
