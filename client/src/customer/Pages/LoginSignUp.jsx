import React, { useState } from 'react';
import './LoginSignUp.css';

const LoginSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Toggle between Login and Sign-Up views 
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(''); // Reset error message when toggling
    setSuccess(''); // Reset success message when toggling
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        const email = e.target.email.value;
        const password = e.target.password.value;
        // Simple validation
        if (!email || !password) {
          reject('Email and password are required.');
        } else if (isSignUp && password !== e.target['confirm-password'].value) {
          reject('Passwords do not match.');
        } else {
          resolve('Success!'); // Simulate successful sign-up/login
        }
      }, 2000); // Simulate a 2-second API response time
    })
      .then((message) => {
        setSuccess(message);
      })
      .catch((errorMessage) => {
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-signup-container">
      {/* Form Wrapper */}
      <div className="form-wrapper">
        {/* Toggle Heading */}
        <h2>{isSignUp ? 'Create an Account' : 'Login'}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>

          {/* Display error or success message */}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
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
