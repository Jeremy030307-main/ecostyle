import React, { useState, useRef, useEffect } from 'react';
import './LoginSignUp.css';
import formImage from '../Components/Assets/form-bg.png'
import logo from '../Components/Assets/logo_image.png'
import { Navigate } from "react-router-dom";
import AuthenticationManager from '../../authentication/authenticationManager';

const LoginSignUp = () => {

  const [isSignUp, setIsSignUp] = useState(false);
  const formRef = useRef(null);
  const [isAuthenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = AuthenticationManager.auth.onAuthStateChanged((user) => {
      if (user) {
        if (!user.isAnonymous){
          console.log("authentication is true")
          setAuthenticated(true);
        }
      } else {
        setAuthenticated(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Toggle between Login and Sign-Up views 
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const checkPassword = (p1, p2) => {
    return (p1 === p2);
  }

  const handleSubmit = async (event) => {

    event.preventDefault();
    const formData = new FormData(event.target);

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
      await AuthenticationManager.signUp(fname, lname, email, password)

    } else {
      await AuthenticationManager.signIn(email, password)
    }
  };

  if (isAuthenticated === true) {
    return <Navigate to="/" replace />; // Redirect to home page
  }

  return (
    <div className="form-container">
      {/* Left (Form Image) */}
      <div className='form-image'>
        <img src={formImage} alt="" />
      </div>

      {/* Right (Form Content) */}
      <form className='form-content' onSubmit={handleSubmit} ref={formRef}>

        {/* Form Heading */}
        <div className='form-header'>
          <img src={logo} alt="" />
          <h1>{isSignUp ? 'Create an Account' : 'Login'}</h1>
        </div>

        <div className='field-wrap'>
          {isSignUp && (
            <>
              {/* First Name Field */}
              <div className="form-field">
                <input type="text" id="fname" name='fname' placeholder="My First Name" required />
                <div className='field-label'>
                  <label htmlFor="fname">First Name</label>
                </div>
              </div>

              {/* Last Name Field */}
              <div className="form-field">
                <input type="text" id="lname" name='lname' placeholder="My Last Name" required />
                <div className='field-label'>
                  <label htmlFor="lname">Last Name</label>
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="form-field">
            <input type="email" id="email" name='email' placeholder="Enter your email" required />
            <div className='field-label'>
              <label htmlFor="email">Email</label>
            </div>
          </div>

          {/* Password Field */}
          <div className="form-field">
            <input type="password" id="password" name='password' placeholder="Enter your password" required />
            <div className='field-label'>
              <label htmlFor="password">Password</label>
            </div>
          </div>

          {/* If SignUp is active, show additional fields */}
          {isSignUp && (
            <>
              {/* Confirm Password Field */}
              <div className="form-field">
                <input type="password" id="confirm-password" name='confirm-password' placeholder="Confirm your password" required />
                <div className='field-label'>
                  <label htmlFor="confirm-password">Confirm Password</label>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button className="submit-btn" type="submit">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>

        </div>

        <div className='form-footer'>
          <p>{isSignUp ? 'Already have an account?' : "Don't have an account? "} 
            <span className='toggleSignIn' onClick={toggleForm}>{isSignUp ? 'Sign In' : 'Sign Up'}</span>
          </p>     
        </div>
      </form>
    </div>
  );
};

export default LoginSignUp;
