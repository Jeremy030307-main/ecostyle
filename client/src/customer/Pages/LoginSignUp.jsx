import React, { useState, useRef } from 'react';
import './LoginSignUp.css';
import { useAuth } from '../../authentication/authContext';
import formImage from '../Components/Assets/form-bg.png'
import logo from '../Components/Assets/logo_image.png'
import { Navigate } from "react-router-dom";

const LoginSignUp = () => {

  const [isSignUp, setIsSignUp] = useState(false);

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

  const checkPassword = (p1, p2) => {
    return (p1 === p2);
  }

  const handleSubmit = (event) => {

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
      state = signUp(fname, lname, email, password);
    } else {
      login(email, password)
        .then(result => {
          console.log(result)
          state = result
        })
        .catch(error=> {
          console.log(error)
          state = false
        });

      if (state === false){
        formRef.current.reset()};
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />; // Redirect to home page
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

        {/* Form */}
        <form>
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
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
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
