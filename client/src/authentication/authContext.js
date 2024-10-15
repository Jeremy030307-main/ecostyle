import React, { createContext, useContext, useState } from "react";
import AuthenticationManager from "./authenticationManager";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  // const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async(email, password) => {

    const tokenID = await AuthenticationManager.signIn("",""); 

    if (tokenID){
      localStorage.setItem('token', tokenID)
      setToken(tokenID)
    }
  };

  const logout = async() => {

    try {
      await AuthenticationManager.signOut();
      localStorage.setItem('token', null)
      setToken(null)
    } catch (error) {
      console.error("Logout failed", error)
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout,token }}>
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