import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo_text from '../Assets/logo_text.png'
import cart_icon from '../Assets/cart.svg'
import wishlist_icon from '../Assets/wishlist.svg'
import account_icon from '../Assets/account.svg'
import admin_icon from '../Assets/admin_icon.svg'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../authentication/authContext';
import { useLocation } from 'react-router-dom';
import { ROLES } from '../../../authentication/authRole';

const NoDecorationLink = styled(Link)`
  text-decoration: none;
  color: #626262; /* Change this to your desired color */
`;

const Navbar = () => {

    const [menu,setMenu] = useState("");
    const { isAuthenticated,role} = useAuth();

    const location = useLocation(); // Get the current location
    useEffect(() => {
        const pathSegments = location.pathname.split('/'); // Split the pathname by '/'
        const lastSegment = pathSegments[pathSegments.length - 1]; // Get the last segment

        // Update menu only if it's currently empty
        if (menu === "") {
            setMenu(lastSegment || "home");
        }
    }, [location.pathname]); // Run effect when pathname changes

    return (
        <div className="navbar">
            <div className='nav-logo'>
                <Link to='/'><img src={logo_text} alt=''/></Link>
            </div>
            <ul className='nav-menu'>
                <li onClick={() => {setMenu("home")}}><NoDecorationLink to={`/`}>Home</NoDecorationLink>{menu==="home"?<hr/>:<></>}</li>
                 <li onClick={() => {setMenu("shop")}}><NoDecorationLink to={`/shop`}>Shop</NoDecorationLink>{menu==="shop"?<hr/>:<></>}</li>
                 <li onClick={() => {setMenu("eco-point")}}><NoDecorationLink to={`/eco-point`}>EcoPoint</NoDecorationLink>{menu==="eco-point"?<hr/>:<></>}</li>
                 <li onClick={() => {setMenu("about")}}><NoDecorationLink to={`/about`}>About</NoDecorationLink>{menu==="about"?<hr/>:<></>}</li>
            </ul>

            <div className='nav-account-cart-wishlist'>
                <Link to='/wishlist'><img onClick={() => {setMenu("wishlist")}} src={wishlist_icon} alt="" /></Link>
                <Link to='/cart'><img onClick={() => {setMenu("cart")}} src={cart_icon} alt="" /></Link>
                <div className='nav-cart-count'>0</div>
                <Link to= {isAuthenticated ? '/account':'/login'}><img onClick={() => {setMenu("profile")}} src={account_icon} alt="" /></Link>
                {(role === ROLES.ADMIN) ? <Link to='/admin'><img onClick={() => {setMenu("admin")}} src={admin_icon} alt="" /></Link> : <></>}
                
            </div>
        </div>
    );
}

export default Navbar;

