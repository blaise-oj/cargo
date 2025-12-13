import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section">
            <h3>Airrush Charters</h3>
            <p className="footer-description">
              Your trusted partner for reliable air cargo services worldwide. 
              We deliver excellence in logistics with precision and care.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+447401149968</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>info@airrushcharters.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Location: South Africa<br/>
                  Branch - NAIROBI</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/destinations">Destinations</a></li>
              <li><a href="/tracking">Track Shipment</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li><a href="/air-freight">Air Freight</a></li>
              <li><a href="/charter-services">Charter Services</a></li>
              <li><a href="/customs-clearance">Customs Clearance</a></li>
              <li><a href="/warehousing">Warehousing</a></li>
              <li><a href="/logistics">Logistics Solutions</a></li>
              <li><a href="/dangerous-goods">Dangerous Goods Handling</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4>Stay Updated</h4>
            <p className="newsletter-text">
              Subscribe to our newsletter for the latest updates and offers
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                <span className="send-icon">✈️</span>
              </button>
            </div>
            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="#" className="social-link facebook">FB</a>
                <a href="#" className="social-link twitter">TW</a>
                <a href="#" className="social-link instagram">IG</a>
                <a href="#" className="social-link whatsapp">WA</a>
                <a href="#" className="social-link linkedin">IN</a>
                <a href="#" className="social-link youtube">YT</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Airrush Charters. All rights reserved.</p>
            <div className="footer-legal">
              <a href="/privacy">Privacy Policy</a>
              <span className="divider">|</span>
              <a href="/terms">Terms of Service</a>
              <span className="divider">|</span>
              <a href="/cookies">Cookie Policy</a>
              <span className="divider">|</span>
              <a href="/sitemap">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;