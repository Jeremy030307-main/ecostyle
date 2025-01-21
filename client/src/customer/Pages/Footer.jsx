import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Exclusive Section */}
        <div>
          <h3>Exclusive</h3>
          <p>Get 10% off your first order</p>
          <input type="email" placeholder="Enter your email" />
        </div>

        {/* Support Section */}
        <div>
          <h4>Support</h4>
          <p>111 Bijoy Sarani, Dhaka</p>
          <p>exclusive@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4>Quick Links</h4>
          <p><a href="/privacy-policy" className="footer-link">Privacy Policy</a></p>
          <p><a href="https://docs.google.com/document/d/1JHABGkJ12Ybw4hDYA93x-BB_MNTgrrh4/edit?usp=share_link&ouid=104363821167339905367&rtpof=true&sd=true" className="footer-link" target="_blank" rel="noopener noreferrer">Terms of Use</a></p>
          <p><a href="/faq" className="footer-link">FAQ</a></p>
          <p><a href="/contact" className="footer-link">Contact</a></p> {/* Add Contact Link */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
