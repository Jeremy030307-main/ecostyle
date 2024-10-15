import React, { useState } from 'react';
import './LoginSignUp.css';

const LoginSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Toggle between Login and Sign-Up views 
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="login-signup-container">
      {/* Form Wrapper */}
      <div className="form-wrapper">
        {/* Toggle Heading */}
        <h2>{isSignUp ? 'Create an Account' : 'Login'}</h2>

        {/* Form */}
        <form>
          {/* Email Field */}
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>

          {/* Password Field */}
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>

          {/* If SignUp is active, show additional fields */}
          {isSignUp && (
            <>
              {/* Confirm Password Field */}
              <div className="form-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" placeholder="Confirm your password" required />
              </div>

              {/* Username Field */}
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Choose a username" required />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button className="submit-btn" type="submit">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="toggle-message">
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button className="toggle-btn" onClick={toggleForm}>
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
