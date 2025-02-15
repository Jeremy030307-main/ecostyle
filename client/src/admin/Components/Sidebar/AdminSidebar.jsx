import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../Assets/assets";
import "./AdminSidebar.css"; // Updated the CSS file name

const AdminSidebar = () => {
  // Updated component name
  return (
    <div className="admin-sidebar-container">
      <div className="admin-sidebar-section">
        <NavLink className="admin-sidebar-link" to="products">
          <img src={assets.order_icon} alt="" />
          <p>Products</p>
        </NavLink>
      </div>

      <div className="admin-sidebar-section">
        <NavLink className="admin-sidebar-link" to="orders">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
      </div>

      <div className="admin-sidebar-section">
        <NavLink className="admin-sidebar-link" to="collections">
          <img src={assets.order_icon} alt="" />
          <p>Collections</p>
        </NavLink>
      </div>

      <div className="admin-sidebar-section">
        <NavLink className="admin-sidebar-link" to="categories">
          <img src={assets.order_icon} alt="" />
          <p>Categories</p>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
