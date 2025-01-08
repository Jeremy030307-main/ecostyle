import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./authenticationManager";

const AdminRoutes = () => {

  const {isAdmin} = useAuth();

  return (isAdmin === true) ? <Outlet /> : <Navigate to="/" />;
};


// const UserRoutes = () => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
// }

export default AdminRoutes;
