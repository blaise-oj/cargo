import React, { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import logo1 from "../../assets/logo1.png";
import menu_icon from "../../assets/menu-icon.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMobileMenu((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenu(false);
      }
    };

    if (mobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenu]);

  return (
    <header className={`navbar ${sticky ? "navbar--sticky" : ""}`}>
      <div className="navbar__inner">
        <img src={logo1} alt="Airrush Charters" className="navbar__logo" />

        <ul
          ref={menuRef}
          className={`navbar__menu ${mobileMenu ? "active" : ""}`}
        >
          <li><Link to="/">Home</Link></li>
          <li><Link to="/passenger-charters">Passenger Charters</Link></li>
          <li><Link to="/cargo-charters">Cargo Charters</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>

        <img
          src={menu_icon}
          alt="Menu"
          className="navbar__menu-icon"
          onClick={toggleMenu}
        />
      </div>
    </header>
  );
};

export default Navbar;
