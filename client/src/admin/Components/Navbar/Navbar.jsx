import React from 'react'
import {assets} from '../Assets/assets'
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='navbar-container'>
            <img src={assets.logo_text} alt ="" />
            <Link to='../Login'>
                <button className='logout-btn'>Logout</button>
            </Link>
        </div>
    )
}

export default Navbar