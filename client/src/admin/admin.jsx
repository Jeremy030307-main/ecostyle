import AdminSidebar from "./Components/Sidebar/AdminSidebar";
import Navbar from "./Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import "./admin.css";

export const currency = "$";

const Admin = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="content-wrapper">
        <AdminSidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
