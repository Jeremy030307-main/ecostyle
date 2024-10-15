import React, { useState } from 'react';
import './Navbar.css';
import logo_text from '../Assets/logo_text.png'
import cart_icon from '../Assets/cart.svg'
import wishlist_icon from '../Assets/wishlist.svg'
import account_icon from '../Assets/account.svg'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../authentication/authContext';

const NoDecorationLink = styled(Link)`
  text-decoration: none;
  color: #626262; /* Change this to your desired color */
`;

const Navbar = () => {

    const [menu,setMenu] = useState("home");
    const { login, logout, token } = useAuth();

    return (
        <div className="navbar">
            <div className='nav-logo'>
                <Link to='/'><img src={logo_text} alt=''/></Link>
            </div>
            <p>{token}</p>
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
                <Link to='/account'><img onClick={() => {setMenu("profile")}} src={account_icon} alt="" /></Link>
                <img onClick={() => {login()}} src={account_icon} alt="" />
                <img onClick={() => {logout()}} src={account_icon} alt="" />
            </div>
        </div>
    );
}

export default Navbar;