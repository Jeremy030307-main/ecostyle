import React, { useState } from 'react';
import './LoginSignUp.css';

const LoginSignUp = () => {

  // State variables to manage form data and toggle between login/signup mode.
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');


  // Toggle between Login and Sign-Up views 
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

    // Function to reset all form fields to empty strings upon view change.
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // If signing up, validate that password and confirm password fields should match.
    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const formData = {
      email,
      password,
      ...(isSignUp && { username }),
    };

    console.log('Form Data:',formData );

    alert(`${isSignUp ? 'Sign Up' : 'Login'} successful!`);
    resetForm();
  };

  return (
    <div className="login-signup-container">
      {/* Form Wrapper */}
      <div className="form-wrapper">
        {/* Toggle Heading */}
        <h2>{isSignUp ? 'Create an Account' : 'Login'}</h2>

        {/* Form element with submission handler */}
        <form onSubmit={handleSubmit}>
          
          {/* Email input field */}
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password input field */}
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Additional fields for Sign Up mode only */}
          {isSignUp && (
            <>
              {/* Confirm Password input field for Sign Up */}
              <div className="form-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Username input field for Sign Up */}
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required 
                />
              </div>
            </>
          )}

          {/* Submit button changes label based on Login/Sign Up mode */}
          <button className="submit-btn" type="submit">
            {isSignUp ? 'Sign Up' : 'Login'} {/* Button text updates dynamically */}
          </button>
        </form>

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