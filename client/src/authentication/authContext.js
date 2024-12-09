import React, { createContext, useContext, useState } from "react";
import AuthenticationManager from "./authenticationManager";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  const [role, setRole] = useState(localStorage.getItem('role'))
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(localStorage.getItem('user'));

  const signUp = async(fname, lname, email, password) => {

    const signInToken = await AuthenticationManager.signUp(fname,lname, email, password); 

    if (signInToken){
      const tokenID = signInToken.idToken
      const user = await AuthenticationManager.getUser(signInToken.uid);
      if ((tokenID) && (user)){
        localStorage.setItem('token', tokenID);
        localStorage.setItem('user', user);
        localStorage.setItem('role', user.role);
        setToken(tokenID);
        setRole(user.role);
        setUser(user)
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
        localStorage.setItem('token', tokenID);
        localStorage.setItem('user', user);
        localStorage.setItem('role', user.role);
        setToken(tokenID);
        setRole(user.role);
        setUser(user)
        return true
      }
    }
    return false
  };

  const logout = async() => {

    try {
      await AuthenticationManager.signOut();
      localStorage.setItem('token', null)
      localStorage.setItem('user', null)
      setToken(null);
      localStorage.setItem('role', null)
      setRole(null);
      setUser(null)
      return true
    } catch (error) {
      console.error("Logout failed", error)
      return false
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated,token,role,user,login, logout, signUp }}>
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