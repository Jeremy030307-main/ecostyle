import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../Assets/assets';
import "./Sidebar.css"

const Sidebar = () => {
    return (
        <div className="sidebar-container">

            <div className="sidebar-section">
                <NavLink className="sidebar-link" to="./products">
                    <img src={assets.order_icon} alt="" />
                    <p>Products</p>
                </NavLink>
            </div>

            <div className="sidebar-section">
                <NavLink className="sidebar-link" to="./orders">
                    <img src={assets.order_icon} alt="" />
                    <p>Orders</p>
                </NavLink>
            </div>

            <div className="sidebar-section">
                <NavLink className="sidebar-link" to="./category">
                    <img src={assets.order_icon} alt="" />
                    <p>Category</p>
                </NavLink>
            </div>

            <div className="sidebar-section">
                <NavLink className="sidebar-link" to="./subcategory">
                    <img src={assets.order_icon} alt="" />
                    <p>Subcategory</p>
                </NavLink>
            </div>

        </div>
    );
};

export default Sidebar;
