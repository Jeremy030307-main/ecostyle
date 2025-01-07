import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo_text from '../Assets/logo_text.png';
import cart_icon from '../Assets/cart.svg';
import wishlist_icon from '../Assets/wishlist.svg';
import account_icon from '../Assets/account.svg';
import admin_icon from '../Assets/admin_icon.svg';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import AuthenticationManager from '../../../authentication/authenticationManager';
import { useCart } from '../../../CartContext';
import { useWishlist } from '../../../WishlistContext';  // Import WishlistContext
import { useUserCart } from '../../../apiManager/methods/cartMethods';

const NoDecorationLink = styled(Link)`
  text-decoration: none;
  color: #626262; /* Change this to your desired color */
`;

const Navbar = () => {
  const cartData = useUserCart()

  const [totalItem, setTotalItem] = useState(0)
  
    useEffect(() => {
      if (cartData && cartData.length > 0) {
        // Calculate total items and total amount
        const totalQuantity = cartData.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
        setTotalItem(totalQuantity);
      } else {
        setTotalItem(0);
      }
      console.log(cartData)
    }, [cartData]);

  const [menu, setMenu] = useState('');
  const [admin, setAdmin] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to track dropdown visibility
  const location = useLocation(); // Get the current location

  // Get wishlist items from context
  const { wishlistItems } = useWishlist(); // Access wishlist items

  // Calculate the total number of items in the wishlist
  const totalWishlistItems = wishlistItems.length;

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = AuthenticationManager.auth.onAuthStateChanged((user) => {
      if (user) {
        if (!user.isAnonymous) {
          console.log('authentication is true');
          setAuthenticated(true);
        }
        AuthenticationManager.auth.currentUser
          .getIdTokenResult()
          .then((idTokenResult) => {
            setAdmin(Boolean(idTokenResult.claims.admin));
          })
          .catch(() => setAdmin(false)); // Handle error gracefully
      } else {
        setAuthenticated(false);
        setAdmin(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Update menu based on the current path
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1] || 'home';
    setMenu(lastSegment);
  }, [location.pathname]); // Run effect only when the path changes

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo_text} alt="" />
        </Link>
      </div>
      <ul className="nav-menu">
        <li onClick={() => { setMenu('home'); }}>
          <NoDecorationLink to={`/`}>Home</NoDecorationLink>
          {menu === 'home' ? <hr /> : <></>}
        </li>
        <li onClick={() => { setMenu('shop'); }}>
          <NoDecorationLink to={`/shop`}>Shop</NoDecorationLink>
          {menu === 'shop' ? <hr /> : <></>}
        </li>
        {/* <li onClick={() => { setMenu('eco-point'); }}>
          <NoDecorationLink to={`/eco-point`}>EcoPoint</NoDecorationLink>
          {menu === 'eco-point' ? <hr /> : <></>}
        </li> */}
        <li onClick={() => { setMenu('about'); }}>
          <NoDecorationLink to={`/about`}>About</NoDecorationLink>
          {menu === 'about' ? <hr /> : <></>}
        </li>
      </ul>

      <div className="nav-account-cart-wishlist">
        <Link to="/wishlist">
          <img onClick={() => { setMenu('wishlist'); }} src={wishlist_icon} alt="" />
        </Link>
          {/* Display total items in the wishlist as a badge */}
          <div className="nav-wishlist-count">{totalWishlistItems > 0 ? totalWishlistItems : 0}</div>

        <Link to="/cart">
          <img onClick={() => { setMenu('cart'); }} src={cart_icon} alt="" />
        </Link>
        {/* Display the total number of items in the cart */}
        <div className="nav-cart-count">{totalItem > 0 ? totalItem : 0}</div>
        <div className="profile-menu">
          <Link to = {isAuthenticated ? "/account": "/login"}>
          <img onClick={toggleDropdown} src={account_icon} alt="" />
          </Link>
        </div>
        {admin === true ? <Link to="/admin"><img onClick={() => { setMenu('admin'); }} src={admin_icon} alt="" /></Link> : <></>}
      </div>
    </div>
  );
};

export default Navbar;
