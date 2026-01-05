import React, { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import logo1 from '../../assets/logo1.png';
import menu_icon from '../../assets/menu-icon.png';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef(null); // ref for menu
  const location = useLocation(); // track route changes

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenu(false);
  }, [location]);

  return (
    <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
      <img src={logo1} alt="" className='logo' />
      <ul ref={menuRef} className={mobileMenu ? '' : 'hide-mobile-menu'}>
        <li><Link to="/" onClick={() => setMobileMenu(false)}>Home</Link></li>
        <li><Link to="/passenger-charters" onClick={() => setMobileMenu(false)}>Passenger Charters</Link></li>
        <li><Link to="/cargo-charters" onClick={() => setMobileMenu(false)}>Cargo Charters</Link></li>
        <li><Link to="/services" onClick={() => setMobileMenu(false)}>Services</Link></li>
        <li><Link to="/contact" onClick={() => setMobileMenu(false)}>Contact Us</Link></li>
        <li><Link to="/login" onClick={() => setMobileMenu(false)}>Login</Link></li>
        <li><Link to="/register" onClick={() => setMobileMenu(false)}>Register</Link></li>
      </ul>
      <img src={menu_icon} alt='' className='menu-icon' onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;


