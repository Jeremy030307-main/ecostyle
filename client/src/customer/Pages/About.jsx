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
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";



const teamMembers = [
  { id: 1, name: "Hanshika", role: "RTE", image: team5 },
  { id: 2, name: "Nallya", role: "RTE", image: team2 },
  { id: 3, name: "Benjamin Tan En Zhe", role: "Product", image: team3 },
  { id: 4, name: "Bryan Hii Neng Yuan", role: "Marketing Head", image: team4 },
  { id: 5, name: "Foo Jia Wei", role: "HR Manager", image: team3 },
  { id: 6, name: "Benjamin Tan En Zhe", role: "Sales Lead", image: team1 },
  { id: 7, name: "Shivansh", role: "Sales Lead", image: team6 }
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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };
  
  

  return (
    <>
      {/* Header Section */}
      <section className="about-header">
        <div className="about-text">
          <h1>Our Story</h1>
          <p>
          Founded in 2024, EcoStyle is Malaysia's leading sustainable fashion marketplace. 
          Our mission is to inspire conscious living by offering eco-friendly clothing and promoting sustainable practices.
          </p>
          <p>
          EcoStyle is committed to providing high-quality, stylish, and recyclable fashion products, 
          empowering customers to make choices that benefit both people and the planet.
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
                <a href="#!"><FaTwitter /></a>
                <a href="#!"><FaInstagram /></a>
                <a href="#!"><FaLinkedin /></a>
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
    </>
  );
};

export default About;
