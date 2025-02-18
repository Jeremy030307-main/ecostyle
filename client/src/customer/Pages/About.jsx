import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "./About.css";
import bannerImage from "../Components/Assets/figma_image_1.jpeg";
import team1 from "../Components/Assets/old_ceo.jpeg";
import team2 from "../Components/Assets/female_ceo.jpeg";
import team3 from "../Components/Assets/new_ceo.jpeg";
import deliveryIcon from "../Components/Assets/cart.svg";
import serviceIcon from "../Components/Assets/account.svg";
import guaranteeIcon from "../Components/Assets/wishlist.svg";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jones",
    review: "EcoStyle has completely transformed my shopping habits. Their products are eco-friendly, and I love the quality!",
    image: team1,
  },
  {
    id: 2,
    name: "John Smith",
    review: "I’m impressed with their fast delivery and commitment to sustainability. Highly recommended!",
    image: team2,
  },
  {
    id: 3,
    name: "Aisha Khan",
    review: "The clothes are stylish and sustainable. It feels great to shop without harming the environment.",
    image: team3,
  },
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
          <button className="cta-button">
            <Link to="/shop" style={{ textDecoration: "none", color: "white" }}>
              Checkout Here
            </Link>
          </button>
        </div>
        <div className="hero-image">
          <img src={bannerImage} alt="Our Journey" />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="about-stats">
        <h2 className="about-section-title">Our Impact</h2>
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

      {/* Testimonials Section */}
      <section className="about-testimonials">
        <h2 className="about-section-title">What Our Customers Say</h2>
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} />
              <p className="testimonial-review">"{testimonial.review}"</p>
              <h4>{testimonial.name}</h4>
            </div>
          ))}
        </Slider>
      </section>

      {/* Services Section */}
      <section className="about-services">
        <h2 className="about-section-title">Why Choose Us?</h2>
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
