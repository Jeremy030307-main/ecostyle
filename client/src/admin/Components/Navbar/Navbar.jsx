import React from 'react'
import {assets} from '../Assets/assets'
import './Navbar.css';

const Navbar = () => {
    return (
        <div className='navbar-container'>
            <img src={assets.logo_text} alt ="" />
            <button className='logout-btn'>Logout</button>
        </div>
    )
}

export default Navbar