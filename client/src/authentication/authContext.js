import React, { createContext, useContext, useState, useEffect } from "react";
import ApiManager from "../apiManager/ApiManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [role, setRole] = useState(null)
  const [user, setUser] = useState(null);

  const signUp = async(fname, lname, email, password) => {

    try{
      const signInToken = await ApiManager.signUp(fname,lname, email, password); 
      const user = await ApiManager.getUser(signInToken.uid);
      setUser(user)
      setRole(user.role)
      return true
    } catch (error) {
      console.log("error", error)
      return false
    }
  };

  const login = async(email, password) => {

    try{
      const signInToken = await ApiManager.signIn(email, password); 
      console.log("Login")
      const user = await ApiManager.getUser(signInToken.uid);
      console.log("user")
      setUser(user)
      setRole(user.role)
      return true
    } catch (error) {
      console.log("error", error)
      return false
    }
  };

  const logout = async() => {

    try {
      await ApiManager.signOut();
      setUser(null)
      setRole(null)
      return true
    } catch (error) {
      console.error("Logout failed", error)
      return false
    }
  };

  // Persisting user state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setRole(localStorage.getItem('role'))
    }
  }, []);

  // Updating storage on user state change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
  }, [user, role]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated,role,user,login, logout, signUp }}>
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