import React, { createContext, useContext, useState } from "react";
import AuthenticationManager from "./authenticationManager";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  // const [user, setUser] = useState(null)
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [token, setToken] = useState(localStorage.getItem('token'));

  const signUp = async(fname, lname, email, password) => {

    const signInToken = await AuthenticationManager.signUp(fname,lname, email, password); 

    if (signInToken){
      const tokenID = signInToken.idToken
      const user = await AuthenticationManager.getUser(signInToken.uid);
      if ((tokenID) && (user)){
        localStorage.setItem('token', tokenID)
        setToken(tokenID);
        localStorage.setItem('role', user.role)
        setRole(user.role)
        return true
      }
    }
    
    return false
  };

  const login = async(email, password) => {

    console.log(email, password)
    const signInToken = await AuthenticationManager.signIn(email, password); 

    if (signInToken){
      const tokenID = signInToken.idToken
      const user = await AuthenticationManager.getUser(signInToken.uid);

      if ((tokenID) && (user)){
        localStorage.setItem('token', tokenID)
        setToken(tokenID);
        localStorage.setItem('role', user.role)
        setRole(user.role)
        return true
      }
    }
    
    return false
  };

  const logout = async() => {

    try {
      await AuthenticationManager.signOut();
      localStorage.setItem('token', null)
      setToken(null);
      localStorage.setItem('role', null)
      setRole(null);
      console.log("Logout")
    } catch (error) {
      console.error("Logout failed", error)
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated,token,role,login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};