import React, { createContext, useContext, useState } from "react";
import AuthenticationManager from "./authenticationManager";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  // const [user, setUser] = useState(null)
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async(email, password) => {

    const signInToken = await AuthenticationManager.signIn("",""); 
    const tokenID = signInToken.idToken
    const user = await AuthenticationManager.getUser(signInToken.uid);
    
    console.log(signInToken)
    if ((tokenID) && (user)){
      localStorage.setItem('token', tokenID)
      setToken(tokenID);
      localStorage.setItem('role', user.role)
      setRole(user.role)
      console.log(user)
    }
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout,token,role }}>
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