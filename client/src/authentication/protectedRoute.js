import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from './authContext';

const AdminRoutes = () => {

  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};


const UserRoutes = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default AdminRoutes;
