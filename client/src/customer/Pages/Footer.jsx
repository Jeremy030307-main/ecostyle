import React, { useState } from "react";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false); // Track if email has been submitted

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const emailList = JSON.parse(localStorage.getItem("discountedEmails")) || [];

    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    if (emailList.includes(email)) {
      setMessage("This email has already been used for the discount.");
    } else {
      emailList.push(email);
      localStorage.setItem("discountedEmails", JSON.stringify(emailList));
      setMessage("Discount code sent to your email!");
      setEmailSubmitted(true); // Hide input box after submission
      // Simulate sending an email (Replace this with a real API call)
      console.log(`Discount email sent to ${email}`);
    }

    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Exclusive Section */}
        <div>
          <h3>Exclusive</h3>
          <p>Get 10% off your first order</p>
          {!emailSubmitted ? (
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="email-submit-btn">
                Submit
              </button>
            </form>
          ) : (
            <p className="thank-you-message">Thank you! Enjoy your discount.</p>
          )}
          {message && <p className="message">{message}</p>}
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
          <h4>Account</h4>
          <p><a href="/update-profile" className="footer-link">My Account</a></p>
          <p><a href="/login" className="footer-link">Login/Register</a></p>
          <p><a href="/cart" className="footer-link">Cart</a></p>
          <p><a href="/wishlist" className="footer-link">Wishlist</a></p>
          <p><a href="/shop" className="footer-link">Shop</a></p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <p><a href="/privacy-policy" className="footer-link">Privacy Policy</a></p>
          <p><a href="/terms-of-use" className="footer-link">Terms of Use</a></p>
          <p><a href="/faq" className="footer-link">FAQ</a></p>
          <p><a href="/contact" className="footer-link">Contact</a></p>
        </div>    
      </div>
    </footer>
  );
};

export default Footer;
