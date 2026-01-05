import React from 'react';
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
                <span className="contact-icon">📞</span>
                <a href="tel:+447401149968">+44 7401 149968</a>
              </div>

              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <a href="mailto:info@airrushcharters.com">
                  info@airrushcharters.com
                </a>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📍</span>
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
              <a href="/privacy">Privacy</a>
              <span className="divider">|</span>
              <a href="/terms">Terms</a>
              <span className="divider">|</span>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
