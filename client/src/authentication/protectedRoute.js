import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from './authContext';
import { ROLES } from "./authRole";

const AdminRoutes = () => {

  const {role} = useAuth();
  console.log(role)

  return (role === ROLES.ADMIN) ? <Outlet /> : <Navigate to="/" />;
};


const UserRoutes = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default AdminRoutes;
