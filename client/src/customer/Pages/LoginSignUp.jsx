import React, { useState, useRef } from 'react';
import './LoginSignUp.css';
import { useAuth } from '../../authentication/authContext';

const LoginSignUp = () => {

  const [isSignUp, setIsSignUp] = useState(false);
  const formRef = useRef(null);
  const { login, signUp } = useAuth();

  // Toggle between Login and Sign-Up views 
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const checkPassword = (p1, p2) => {
    return (p1 === p2);
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    const formData = new FormData(event.target);
    let result = null

    if (isSignUp){
      if (!checkPassword(formData.get('password'), formData.get('confirm-password'))){
        return false
      }
    }

    const email = formData.get('email');
    const password = formData.get('password');

    if (isSignUp){
      const fname = formData.get('fname');
      const lname = formData.get('lname');
      result = signUp(fname, lname, email, password);
      // formRef.current.reset();
    } else {
      result = login(email, password);
      formRef.current.reset();
    }
  };

  return (
    <div className="login-signup-container">
      {/* Form Wrapper */}
      <div className="form-wrapper">
        {/* Toggle Heading */}
        <h2>{isSignUp ? 'Create an Account' : 'Login'}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} ref={formRef}>

        {isSignUp && (
            <>
              {/* First Name Field */}
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input type="text" id="fname" name='fname' placeholder="My First Name" required />
              </div>

              {/* Last Name Field */}
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input type="text" id="lname" name='lname' placeholder="My Last Name" required />
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name='email' placeholder="Enter your email" required />
          </div>

          {/* Password Field */}
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name='password' placeholder="Enter your password" required />
          </div>

          {/* If SignUp is active, show additional fields */}
          {isSignUp && (
            <>
              {/* Confirm Password Field */}
              <div className="form-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" name='confirm-password' placeholder="Confirm your password" required />
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
