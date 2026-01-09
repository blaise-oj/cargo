import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

import jet2 from '../../assets/jet2.png';
import jet11 from '../../assets/jet11.png';
import jet6 from '../../assets/jet6.png';
import jet19 from '../../assets/jet19.png';
import jet5 from '../../assets/jet5.png';
import jet4 from '../../assets/jet4.png';
import h1 from '../../assets/h1.png';
import h2 from '../../assets/h2.png';
import h3 from '../../assets/h3.png';
import h4 from '../../assets/h4.png';
import h5 from '../../assets/h5.png';
import h6 from '../../assets/h6.png';
import h7 from '../../assets/h7.png';


const Services = () => {
  return (
    <section className="services-section" id="home-services">
      <div className="services-container">

        {/* Section Header */}
        <div className="services-header">
          <h2>Our Air Cargo & Passenger Services</h2>
          <p>
            Comprehensive aviation solutions for cargo logistics and passenger
            transportation—delivered with precision, safety, and speed.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">

          {/* Worldwide Air Freight */}
          <div className="service-card">
            <div className="service-image">
              <img src={h1} alt="Worldwide Air Freight" />
            </div>
            <div className="service-content">
              <h3>Worldwide Air Freight</h3>
              <p>
                Fast and secure global air cargo transportation tailored for
                businesses of all sizes. We connect major international hubs
                with reliable delivery timelines.
              </p>
              <div className="home-services-cta">
                <Link to="/cargo-charters">View Charters</Link>
              </div>
            </div>
          </div>

          {/* Customs Clearance */}
          <div className="service-card">
            <div className="service-image">
              <img src={h2} alt="Customs Clearance" />
            </div>
            <div className="service-content">
              <h3>Customs Clearance</h3>
              <p>
                Our experienced logistics team manages all customs documentation
                and regulatory processes, ensuring smooth, delay-free cargo
                movement across borders.
              </p>
              <div className="home-services-cta">
                <Link to="/cargo-charters">View Charters</Link>
              </div>
            </div>
          </div>

          {/* Warehousing */}
          <div className="service-card">
            <div className="service-image">
              <img src={h3} alt="Warehousing Solutions" />
            </div>
            <div className="service-content">
              <h3>Warehousing & Storage</h3>
              <p>
                Secure, flexible warehousing solutions designed to support
                short-term and long-term cargo storage with strict safety and
                inventory controls.
              </p>
              <div className="home-services-cta">
                <Link to="/services">View Services</Link>
              </div>
            </div>
          </div>

          {/* Passenger Charter Flights */}
          <div className="service-card">
            <div className="service-image">
              <img src={h4} alt="Passenger Charter Flights" />
            </div>
            <div className="service-content">
              <h3>Passenger Charter Flights</h3>
              <p>
                Comfortable and reliable passenger charter services for business,
                leisure, and special travel needs—designed for flexibility,
                privacy, and efficiency.
              </p>
              <div className="home-services-cta">
                <Link to="/services">View Services</Link>
              </div>
            </div>
          </div>

          {/* Real-Time Tracking */}
          <div className="service-card">
            <div className="service-image">
              <img src={h6} alt="Real-time Tracking" />
            </div>
            <div className="service-content">
              <h3>Real-Time Cargo & Flight Tracking</h3>
              <p>
                Track your cargo shipments or passenger flights in real time
                using your Airway Bill or flight reference number—anytime,
                anywhere.
              </p>
              <div className="home-services-cta">
                <Link to="/passenger-charters">View Charters</Link>
              </div>
            </div>
          </div>

          {/* End-to-End Logistics */}
          <div className="service-card">
            <div className="service-image">
              <img src={h7} alt="End-to-End Logistics" />
            </div>
            <div className="service-content">
              <h3>End-to-End Logistics Solutions</h3>
              <p>
                From pickup to final delivery, we provide integrated logistics
                solutions combining air transport, storage, tracking, and
                customs expertise.
              </p>
              <div className="home-services-cta">
                <Link to="/services">View Services</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
