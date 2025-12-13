import React from "react";
import "./Contact.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <header className="contact-hero">
        <div className="contact-overlay">
          <div className="contact-hero-content">
            <h1>Contact Us</h1>
            <p>We’re here to help you 24/7. Reach out anytime.</p>
          </div>
        </div>
      </header>

      {/* Contact Info + Form */}
      <section className="contact-section container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have a question about our services? Our team is always ready to
            assist you with your travel or cargo needs.
          </p>
          <div className="info-cards">
            <div className="info-card">
              <FaPhoneAlt className="info-icon" />
              <div className="info-text">
                <h3>Phone</h3>
                <p>+447401149968</p>
              </div>
            </div>

            <div className="info-card">
              <FaEnvelope className="info-icon" />
              <div className="info-text">
                <h3>Email</h3>
                <p>info@airrushcharters.com</p>
              </div>
            </div>

            <div className="info-card">
              <FaMapMarkerAlt className="info-icon" />
              <div className="info-text">
                <h3>Location</h3>
                <p>South Africa</p>
                <h3>Branch</h3>
                <p>Nairobi, KENYA</p>
              </div>
            </div>
          </div>

        </div>

        <div className="contact-form">
          <h2>Send a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Map or CTA */}
      <section className="map-section">
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7419693016086!2d36.92623923714047!3d-1.3309072835512266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f129102505cef%3A0xefc58e7ef0660bf2!2sJomo%20Kenyatta%20International%20Airport!5e0!3m2!1sen!2ske!4v1756989577868!5m2!1sen!2ske"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
