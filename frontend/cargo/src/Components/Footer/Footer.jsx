import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-main">

          {/* Company Info */}
          <div className="footer-section">
            <h3>Airrush Charters</h3>
            <p className="footer-description">
              Your trusted partner for reliable air cargo and passenger transport
              services worldwide. Precision, safety, and speed—every flight.
            </p>

            <div className="footer-contact">

              <div className="contact-item">
                <FaPhoneAlt className="contact-icon" />
                <a href="tel:+254715293884">+254 715 293 884</a>
              </div>

              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:info@airrushcharters.com">
                  info@airrushcharters.com
                </a>
              </div>

              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>
                  South Africa <br />
                  Branch – Nairobi
                </span>
              </div>

            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/passenger-charters">Passenger Charters</Link></li>
              <li><Link to="/cargo-charters">Cargo Charters</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li><Link to="/services">Worldwide Air Freight</Link></li>
              <li><Link to="/passenger-charters">Passenger Charter Flights</Link></li>
              <li><Link to="/services">Customs Clearance</Link></li>
              <li><Link to="/services">Warehousing & Storage</Link></li>
              <li><Link to="/services">End-to-End Logistics</Link></li>
              <li><Link to="/services">Cargo & Flight Tracking</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4>Stay Updated</h4>
            <p className="newsletter-text">
              Get flight updates, cargo alerts, and service announcements.
            </p>

            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-btn" aria-label="Subscribe">
                ✈️
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© 2026 Airrush Charters. All rights reserved.</p>

            <div className="footer-legal">
              <Link to="/contact">Privacy</Link>
              <span className="divider">|</span>
              <Link to="/contact">Terms</Link>
              <span className="divider">|</span>
              <Link to="/contact">Cookies</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
