import React from "react";
import "./Contact.css";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="contact-page">
      <div className="breadcrumb">
        <p>Home / Contact</p>
      </div>

      <div className="contact-container">
        {/* Left Section */}
        <div className="contact-info">
          <h2>Contact Us</h2>
          <div className="info-box">
            <div className="info-icon">
              <FaPhoneAlt />
            </div>
            <div className="info-text">
              <h4>Call To Us</h4>
              <p>We are available 24/7, 7 days a week.</p>
              <p>Phone: +8801611112222</p>
            </div>
          </div>
          <div className="info-box">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-text">
              <h4>Write To Us</h4>
              <p>Fill out our form and we will contact you within 24 hours.</p>
              <p>Emails: customer@exclusive.com</p>
              <p>Emails: support@exclusive.com</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name *" aria-label="Your Name" required />
              <input type="email" placeholder="Your Email *" aria-label="Your Email" required />
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Your Phone *" aria-label="Your Phone" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" aria-label="Your Message" required></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </div>
    </section>
    
  );
};

export default Contact;
