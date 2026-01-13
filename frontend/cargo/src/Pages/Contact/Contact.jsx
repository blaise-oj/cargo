import React from "react";
import "./Contact.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
  FaHeadset
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <header className="contact-hero">
        <div className="contact-overlay">
          <div className="contact-hero-content">
            <h1>Contact Us</h1>
            <p>24/7 Aviation Support for Cargo & Passenger Charters</p>
          </div>
        </div>
      </header>

      {/* Contact Info + Form */}
      <section className="contact-section container">
        <div className="contact-info">
          <h2>Let’s Connect</h2>
          <p className="contact-intro">
            Our aviation specialists are available around the clock to assist
            with cargo charters, passenger flights, urgent logistics, and
            operational support worldwide.
          </p>

          <div className="info-cards">
            {/* Phone */}
            <a href="tel:+254715293884" className="info-card">
              <FaPhoneAlt className="info-icon phone" />
              <div className="info-text">
                <h3>Call Us</h3>
                <p>+254 715 293 884</p>
                <span>Direct operations line</span>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/254715293884"
              target="_blank"
              rel="noopener noreferrer"
              className="info-card"
            >
              <FaWhatsapp className="info-icon whatsapp" />
              <div className="info-text">
                <h3>WhatsApp Support</h3>
                <p>Instant messaging</p>
                <span>Fast response & file sharing</span>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:info@airrushcharters.com"
              className="info-card"
            >
              <FaEnvelope className="info-icon email" />
              <div className="info-text">
                <h3>Email Us</h3>
                <p>info@airrushcharters.com</p>
                <span>Formal inquiries & documentation</span>
              </div>
            </a>

            {/* Location */}
            <a
              href="https://maps.google.com/?q=Jomo+Kenyatta+International+Airport"
              target="_blank"
              rel="noopener noreferrer"
              className="info-card"
            >
              <FaMapMarkerAlt className="info-icon location" />
              <div className="info-text">
                <h3>Our Offices</h3>
                <p>South Africa (HQ)</p>
                <span>Nairobi, Kenya – JKIA</span>
              </div>
            </a>

            {/* Operations Support */}
            <div className="info-card no-link">
              <FaHeadset className="info-icon support" />
              <div className="info-text">
                <h3>Operations Support</h3>
                <p>24/7 Flight & Cargo Monitoring</p>
                <span>Dedicated aviation specialists</span>
              </div>
            </div>

            {/* Working Hours */}
            <div className="info-card no-link">
              <FaClock className="info-icon hours" />
              <div className="info-text">
                <h3>Availability</h3>
                <p>Open 24/7</p>
                <span>365 days a year</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <p className="form-note">
            Tell us about your cargo, destination, or passenger requirements
            and our team will respond promptly.
          </p>

          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="text" placeholder="Subject" required />
            <input type="tel" placeholder="Your Phone" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required />
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Map */}
      <section className="map-section">
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7419693016086!2d36.92623923714047!3d-1.3309072835512266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f129102505cef%3A0xefc58e7ef0660bf2!2sJomo%20Kenyatta%20International%20Airport!5e0!3m2!1sen!2ske!4v1756989577868!5m2!1sen!2ske"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
