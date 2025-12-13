import React, { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import logo1 from '../../assets/logo1.png';
import menu_icon from '../../assets/menu-icon.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef(null); // ref for menu

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenu(false);
      }
    };
    if (mobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenu]);

  return (
    <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
      <img src={logo1} alt="" className='logo1' />
      <ul ref={menuRef} className={mobileMenu ? '' : 'hide-mobile-menu'}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/passenger-charters">Passenger Charters</Link></li>
        <li><Link to="/cargo-charters">Cargo Charters</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
      <img src={menu_icon} alt='' className='menu-icon' onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;

