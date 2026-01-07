import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FaCheckCircle,
} from "react-icons/fa";

/* ---------- Animated Stat Component ---------- */
const Stat = ({ target, label, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const stepTime = Math.max(Math.floor(duration / target), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
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

/* ---------- Main Page ---------- */
const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="services-page">

      {/* ================= HERO ================= */}
      <header
        className="services-hero"
        style={{ backgroundImage: `url(${jet3})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Global Air Charter & Cargo Solutions</h1>
            <p className="hero-subtitle">
              A trusted aviation partner delivering premium passenger and cargo
              charter services with safety, speed, and full transparency.
            </p>

            <div className="hero-stats">
              <Stat target={15} label="Years of Aviation Experience" suffix="+" />
              <Stat target={500} label="Destinations Worldwide" suffix="+" />
              <Stat target={24} label="Operational Support" suffix="/7" />
            </div>
          </div>
        </div>
      </header>

      {/* ================= ABOUT COMPANY ================= */}
      <section className="about-company">
        <div className="container about-grid">
          <div className="about-text">
            <h2>About Our Company</h2>
            <p>
              Global Cargo & Charter Solutions is your premier aviation services provider,
              specializing in passenger and cargo charter operations worldwide. 
            </p>
            <p>
              Our mission is to make air transport safe, reliable, and effortless. With
              access to a worldwide fleet and modern tracking systems, we ensure
              every flight and shipment is delivered on time and with full transparency.
            </p>

            <ul className="about-points">
              <li><FaCheckCircle /> ICAO & international safety compliance</li>
              <li><FaCheckCircle /> Access to aircraft from light jets to airliners</li>
              <li><FaCheckCircle /> Real-time cargo & passenger tracking</li>
              <li><FaCheckCircle /> Dedicated charter coordinators available 24/7</li>
            </ul>
          </div>

          <div className="about-highlights">
            <div className="highlight-box">
              <FaShieldAlt />
              <h4>Safety First</h4>
              <p>Only vetted operators and certified aircraft</p>
            </div>
            <div className="highlight-box">
              <FaHandshake />
              <h4>Trusted Partnerships</h4>
              <p>Strong global aviation and logistics partners</p>
            </div>
            <div className="highlight-box">
              <FaChartLine />
              <h4>Operational Excellence</h4>
              <p>Efficient planning, execution, and reporting</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PASSENGER CHARTER ================= */}
      <section className="flagship-service passenger-service">
        <div className="container service-split">
          <div className="service-info">
            <FaPlane className="flagship-icon" />
            <h2>Passenger Charter Services</h2>
            <p className="service-lead">
              Private aviation designed around your schedule, comfort, and privacy.
            </p>

            <p>
              Our passenger charter services cater to executives, VIPs, government
              officials, and private individuals seeking flexible and secure air
              travel beyond commercial airline limitations.
            </p>

            <ul className="service-features">
              <li>Executive & VIP private jet charters</li>
              <li>Corporate, group & delegation travel</li>
              <li>Medical evacuation & special missions</li>
              <li>Flexible routing and departure times</li>
              <li>Luxury cabins and personalized service</li>
            </ul>

            <div className="service-actions">
              <button
                className="service-cta"
                onClick={() => navigate("/passenger-charters")}
              >
                Request Passenger Quote
              </button>
              <button
                className="service-secondary"
                onClick={() => navigate("/passenger-charters")}
              >
                Track Passenger Flight
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CARGO CHARTER ================= */}
      <section className="flagship-service cargo-service">
        <div className="container service-split">
          <div className="service-info">
            <FaBoxes className="flagship-icon" />
            <h2>Cargo Charter Services</h2>
            <p className="service-lead">
              Time-critical, secure, and customized air cargo solutions.
            </p>

            <p>
              We support businesses, humanitarian organizations, and governments
              with efficient air cargo charters — from urgent shipments to
              oversized and project cargo — backed by live tracking and expert handling.
            </p>

            <ul className="service-features">
              <li>General, express & priority cargo</li>
              <li>Humanitarian & NGO relief operations</li>
              <li>Oversized, heavy & project cargo</li>
              <li>Dangerous goods & special cargo handling</li>
              <li>Real-time shipment tracking & reporting</li>
            </ul>

            <div className="service-actions">
              <button
                className="service-cta"
                onClick={() => navigate("/cargo-charters")}
              >
                Request Cargo Quote
              </button>
              <button
                className="service-secondary"
                onClick={() => navigate("/cargo-charters")}
              >
                Track Cargo Shipment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Why Clients Choose Us</h2>

          <div className="reasons-grid">
            <div className="reason-card">
              <FaGlobe />
              <h4>Global Coverage</h4>
              <p>Worldwide access with regional expertise</p>
            </div>
            <div className="reason-card">
              <FaClock />
              <h4>Time-Critical Focus</h4>
              <p>Optimized planning for urgent missions</p>
            </div>
            <div className="reason-card">
              <FaShieldAlt />
              <h4>Safety & Compliance</h4>
              <p>Strict adherence to aviation standards</p>
            </div>
            <div className="reason-card">
              <FaHeadset />
              <h4>24/7 Support</h4>
              <p>Dedicated coordinators anytime, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRACKING HIGHLIGHT ================= */}
      <section className="tracking-highlight">
        <div className="container">
          <h2>Real-Time Tracking & Full Transparency</h2>
          <p>
            Monitor your cargo shipments and passenger flights using your airway
            bill or booking reference — full visibility from departure to arrival.
          </p>
          <div className="tracking-buttons">
            <button
              className="cta-primary"
              onClick={() => navigate("/passenger-charters")}
            >
              Track Passenger Flight
            </button>
            <button
              className="cta-primary"
              onClick={() => navigate("/cargo-charters")}
            >
              Track Cargo Shipment
            </button>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="services-cta">
        <div className="container">
          <h2>Ready to Fly or Ship with Confidence?</h2>
          <p>
            Speak to our aviation experts today and let us design a tailored
            charter solution that meets your exact needs.
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
