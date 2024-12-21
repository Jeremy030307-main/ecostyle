import { Outlet, Navigate } from "react-router-dom";
import AuthenticationManager from "./authenticationManager";
import { useState, useEffect } from "react";

const AdminRoutes = () => {

  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const unsubscribe = AuthenticationManager.auth.onAuthStateChanged((user) => {
      if (user) {
        AuthenticationManager.auth.currentUser
          .getIdTokenResult()
          .then((idTokenResult) => {
            setAdmin(Boolean(idTokenResult.claims.admin));
          })
          .catch(() => setAdmin(false))
          .finally(() => setLoading(false)); // Ensure loading ends
      } else {
        setAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Show a loading screen while checking
  if (loading) {
    return <div>Loading...</div>;
  }

  return (admin === true) ? <Outlet /> : <Navigate to="/" />;
};


// const UserRoutes = () => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
// }

export default AdminRoutes;
