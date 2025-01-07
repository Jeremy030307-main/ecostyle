import React, { useState, useRef, useEffect } from 'react';
import './LoginSignUp.css';
import formImage from '../Components/Assets/form-bg.png'
import logo from '../Components/Assets/logo_image.png'
import { Navigate } from "react-router-dom";
import AuthenticationManager from '../../authentication/authenticationManager';
import { validatePassword } from 'firebase/auth';

const LoginSignUp = () => {

  const [isSignUp, setIsSignUp] = useState(false);
  const formRef = useRef(null);
  const [isAuthenticated, setAuthenticated] = useState(null)
  const [enterfail, setEnterFail] = useState(false)

  useEffect(() => {
    const unsubscribe = AuthenticationManager.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("fdfdfdfdd")
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

  const [containsLowerCase, setContainsLowerCase] = useState(false); // Fixed naming
  const [containsUpperCase, setContainsUpperCase] = useState(false);
  const [containsNumeric, setContainsNumeric] = useState(false);
  const [contians6character, setContians6character] = useState(false)

  const validPassword = async (password) => {
    const status = await validatePassword(AuthenticationManager.auth, password);

    if (!status.isValid) {
      setContainsLowerCase(status.containsLowercaseLetter);
      setContainsUpperCase(status.containsUppercaseLetter);
      setContainsNumeric(status.containsNumericCharacter);
      setContians6character(status.meetsMinPasswordLength)
    } else {
      setContainsLowerCase(true);
      setContainsUpperCase(true);
      setContainsNumeric(true);
      setContians6character(true)
    }
  };

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fname, setfname] = useState("")
  const [lname, setlname] = useState("")
  const [conPass, setConPas] = useState("")

  const [samePassword, setSamePassword] = useState(null)
  const checkPassword = (p1, p2) => {
    if (p1 && p2 && p1 !== "" && p2 !=="" ){
      setSamePassword(p1 === p2);
    } else {
      setSamePassword(null)
    }
  }

  const clearForm = () =>{
    setEmail("")
    setPassword("")
    setfname("")
    setlname("")
    setConPas("")
    checkPassword("", "")
    validPassword("")
    setEnterFail(false)
  }

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {
      if (isSignUp){
        if (samePassword && containsLowerCase && containsNumeric && containsUpperCase && contians6character){
        await AuthenticationManager.signUp(fname, lname, email, password)
        }
  
      } else {
        await AuthenticationManager.signIn(email, password)
      }

      setAuthenticated(true)
    } catch (error) {
      console.log("Error", error.message)
      setEnterFail(true)
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
                <input type="text" id="fname" name='fname' placeholder="My First Name" value={fname} onChange={(e) => setfname(e.target.value)} required />
                <div className='field-label'>
                  <label htmlFor="fname">First Name</label>
                </div>
              </div>

              {/* Last Name Field */}
              <div className="form-field">
                <input type="text" id="lname" name='lname' placeholder="My Last Name" value={lname} onChange={(e) => setlname(e.target.value)} required />
                <div className='field-label'>
                  <label htmlFor="lname">Last Name</label>
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="form-field">
            <input type="email" id="email" name='email' placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className='field-label'>
              <label htmlFor="email">Email</label>
            </div>
          </div>

          {/* Password Field */}
          <div className="form-field">
            <input type="password" id="password" name='password' placeholder="Enter your password" value={password} onChange={(e) => {validPassword(e.target.value); setPassword(e.target.value); ; checkPassword(e.target.value, conPass)}} required />
            <div className='field-label'>
              <label htmlFor="password">Password</label>
            </div>
            {isSignUp && (
            <>
              <span className={`login-error-message ${contians6character ? 'ok' : 'error'}`}>
                <i className={`fa-solid ${contians6character ? 'fa-check' : 'fa-xmark'}`}></i>Minimum 6 character
              </span>

              <span className={`login-error-message ${containsLowerCase ? 'ok' : 'error'}`}>
                <i className={`fa-solid ${containsLowerCase ? 'fa-check' : 'fa-xmark'}`}></i>Contain Lower Case Character
              </span>

              <span className={`login-error-message ${containsUpperCase ? 'ok' : 'error'}`}>
                <i className={`fa-solid ${containsUpperCase ? 'fa-check' : 'fa-xmark'}`}></i>Contain Upper Case Character
              </span>

              <span className={`login-error-message ${containsNumeric ? 'ok' : 'error'}`}>
                <i className={`fa-solid ${containsNumeric ? 'fa-check' : 'fa-xmark'}`}></i>Contain Numeric Character
              </span>
            </>
          )}

          {enterfail && (
            <span className={`login-error-message error`}>
            Failed to {isSignUp ? "sign up": "sign in"}. Invalid email/ password
      </span>
          )}
          </div>

          {/* If SignUp is active, show additional fields */}
          {isSignUp && (
            <>
              {/* Confirm Password Field */}
              <div className="form-field">
                <input type="password" id="confirm-password" name='confirm-password' placeholder="Confirm your password" value={conPass} onChange={(e) => {setConPas(e.target.value); checkPassword(e.target.value, password)}} required />
                {/* <span>fjfjffj</span> */}
                <div className='field-label comfirm-passsord'>
                  <label htmlFor="confirm-password">Confirm Password</label>
                </div>
                {samePassword!==null && (
                    samePassword ? (
                      <span className='login-error-message ok'><i class="fa-solid fa-check"></i>Password Match</span>
                  ): 
                  (
                      <span className='login-error-message error'><i class="fa-solid fa-xmark"></i>Password Not Match</span>
                  )
                    )}
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
            <span className='toggleSignIn' onClick={()=> {setIsSignUp(!isSignUp); clearForm()}}>{isSignUp ? 'Sign In' : 'Sign Up'}</span>
          </p>     
        </div>
      </form>
    </div>
  );
};

export default LoginSignUp;
