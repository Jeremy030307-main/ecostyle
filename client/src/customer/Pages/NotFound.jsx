import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <h1>404 Not Found</h1>
        <p>Your visited page not found. You may go to the home page.</p>
        <Link to="/" className="back-home-btn">
          Back to home page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
