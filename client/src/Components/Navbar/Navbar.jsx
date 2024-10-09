import React, { useState } from 'react';
import './Navbar.css';
import logo_text from '../Assets/logo_text.png'
import cart_icon from '../Assets/cart.svg'
import wishlist_icon from '../Assets/wishlist.svg'
import account_icon from '../Assets/account.svg'


const Navbar = () => {

        const [menu,setMenu] = useState("shop");
    return (
        <div className="navbar">
            <div className='nav-logo'>
                <img src={logo_text} alt=''/>
            </div>

            <ul className='nav-menu'>
                 <li onClick={() => {setMenu("shop")}}>Shop{menu==="shop"?<hr/>:<></>}</li>
                 <li onClick={() => {setMenu("eco-point")}}>EcoPoint{menu==="eco-point"?<hr/>:<></>}</li>
                 <li onClick={() => {setMenu("about")}}>About{menu==="about"?<hr/>:<></>}</li>
            </ul>

            <div className='nav-account-cart-wishlist'>
                <img src={wishlist_icon} alt="" />
                <img src={cart_icon} alt="" />
                <div className='nav-cart-count'>0</div>
                <img src={account_icon} alt="" />
            </div>
        </div>
    );
}

export default Navbar;