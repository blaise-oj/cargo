import React, { useEffect, useState } from "react";
import "./ServicesPage.css";
import jet3 from "../../assets/jet3.png";
import {
  FaPlane,
  FaBoxes,
  FaGlobe,
  FaHandshake,
  FaClock,
  FaShieldAlt,
  FaHeadset,
  FaChartLine,
} from "react-icons/fa";

// Reusable Stat Component with count-up effect
const Stat = ({ target, label, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // animation duration in ms
    const stepTime = Math.max(Math.floor(duration / target), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="stat">
      <span className="stat-number">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const ServicesPage = () => {
  return (
    <div className="services-page">
      {/* Hero Section */}
      <header className="services-hero" style={{ backgroundImage: `url(${jet3})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Premium Air Charter Solutions</h1>
            <p className="hero-subtitle">
              Experience unparalleled service with our global air charter
              network. Wherever you need to go, whatever you need to ship, we
              deliver excellence.
            </p>

            {/* Animated Hero Stats */}
            <div className="hero-stats">
              <Stat target={15} label="Years Experience" suffix="+" />
              <Stat target={500} label="Global Destinations" suffix="+" />
              <Stat target={24} label="Support" suffix="/7" />
            </div>
          </div>
        </div>
      </header>

      {/* Services Introduction */}
      <section className="services-intro">
        <div className="container">
          <h2>Our Comprehensive Services</h2>
          <p className="intro-text">
            At Global Cargo & Charter Solutions, we provide end-to-end aviation
            services tailored to meet the most demanding requirements. From
            executive travel to critical cargo delivery, our expertise ensures
            seamless operations worldwide.
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="services-list">
        <div className="container">
          <div className="service-card">
            <div className="service-icon-container">
              <FaPlane className="service-icon" />
            </div>
            <h2>Passenger Charters</h2>
            <p>
              Travel in ultimate comfort and privacy with our bespoke passenger
              charter services. Our fleet of luxury aircraft ensures you arrive
              refreshed and on time, with complete flexibility to match your
              schedule.
            </p>
            <ul className="service-features">
              <li>Executive & VIP travel solutions</li>
              <li>Group charters for corporate events</li>
              <li>Medical evacuation services</li>
              <li>Luxury amenities and catering</li>
              <li>Customized flight routing</li>
            </ul>
            <button className="service-cta">Learn More</button>
          </div>

          <div className="service-card">
            <div className="service-icon-container">
              <FaBoxes className="service-icon" />
            </div>
            <h2>Cargo Charters</h2>
            <p>
              Reliable and efficient cargo transport solutions for all freight
              types. Our specialized handling ensures your shipments arrive
              securely and on time, no matter the size or urgency.
            </p>
            <ul className="service-features">
              <li>Express and time-sensitive shipments</li>
              <li>Oversized and heavy cargo handling</li>
              <li>Temperature-controlled transport</li>
              <li>Dangerous goods expertise</li>
              <li>Real-time tracking and monitoring</li>
            </ul>
            <button className="service-cta">Learn More</button>
          </div>

          <div className="service-card">
            <div className="service-icon-container">
              <FaGlobe className="service-icon" />
            </div>
            <h2>Global Network</h2>
            <p>
              With worldwide coverage and strategic partnerships, we connect you
              to destinations across the globe with unmatched flexibility and
              reliability.
            </p>
            <ul className="service-features">
              <li>International destination coverage</li>
              <li>Multi-modal transportation solutions</li>
              <li>Customs clearance services</li>
              <li>Local expertise in every region</li>
              <li>24/7 operational support</li>
            </ul>
            <button className="service-cta">Learn More</button>
          </div>

          <div className="service-card">
            <div className="service-icon-container">
              <FaHandshake className="service-icon" />
            </div>
            <h2>Custom Solutions</h2>
            <p>
              From corporate travel to humanitarian aid missions, we design
              tailored solutions that meet your exact requirements, timeline,
              and budget constraints.
            </p>
            <ul className="service-features">
              <li>Bespoke aviation programs</li>
              <li>Long-term partnership agreements</li>
              <li>Emergency response planning</li>
              <li>Cost-optimized routing</li>
              <li>Dedicated account management</li>
            </ul>
            <button className="service-cta">Learn More</button>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="additional-services">
        <div className="container">
          <h2>Additional Services</h2>
          <div className="additional-grid">
            <div className="additional-card">
              <FaClock className="additional-icon" />
              <h3>On-Demand Services</h3>
              <p>24/7 availability for urgent charters and last-minute requests</p>
            </div>
            <div className="additional-card">
              <FaShieldAlt className="additional-icon" />
              <h3>Safety & Compliance</h3>
              <p>Full regulatory compliance and industry-leading safety standards</p>
            </div>
            <div className="additional-card">
              <FaHeadset className="additional-icon" />
              <h3>Dedicated Support</h3>
              <p>Personalized service with dedicated flight coordinators</p>
            </div>
            <div className="additional-card">
              <FaChartLine className="additional-icon" />
              <h3>Logistics Consulting</h3>
              <p>Expert advice on optimizing your supply chain and travel logistics</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container">
          <h2>Ready to Elevate Your Travel or Shipping Experience?</h2>
          <p>
            Contact our team of experts to discuss your specific requirements
            and discover how our premium charter services can work for you.
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">Get a Quote</button>
            <button className="cta-secondary">Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
