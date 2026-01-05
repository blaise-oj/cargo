import React from 'react';
import './Services.css';
import jet2 from '../../assets/jet2.png';
import jet11 from '../../assets/jet11.png';
import jet6 from '../../assets/jet6.png';
import jet19 from '../../assets/jet19.png';
import jet5 from '../../assets/jet5.png';
import jet4 from '../../assets/jet4.png';

const Services = () => {
  return (
    <section className="services-section">
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

          {/* Cargo – Worldwide Air Freight */}
          <div className="service-card">
            <div className="service-image">
              <img src={jet2} alt="Worldwide Air Freight" />
            </div>
            <div className="service-content">
              <h3>Worldwide Air Freight</h3>
              <p>
                Fast and secure global air cargo transportation tailored for
                businesses of all sizes. We connect major international hubs
                with reliable delivery timelines.
              </p>
              <div className="service-cta">
                <a href="/services">View Services <span>→</span></a>
              </div>
            </div>
          </div>

          {/* Cargo – Customs Clearance */}
          <div className="service-card">
            <div className="service-image">
              <img src={jet11} alt="Customs Clearance" />
            </div>
            <div className="service-content">
              <h3>Customs Clearance</h3>
              <p>
                Our experienced logistics team manages all customs documentation
                and regulatory processes, ensuring smooth, delay-free cargo
                movement across borders.
              </p>
              <div className="service-cta">
                <a href="/services">View Services <span>→</span></a>
              </div>
            </div>
          </div>

          {/* Cargo – Warehousing */}
          <div className="service-card">
            <div className="service-image">
              <img src={jet6} alt="Warehousing Solutions" />
            </div>
            <div className="service-content">
              <h3>Warehousing & Storage</h3>
              <p>
                Secure, flexible warehousing solutions designed to support
                short-term and long-term cargo storage with strict safety and
                inventory controls.
              </p>
              <div className="service-cta">
                <a href="/services">View Services <span>→</span></a>
              </div>
            </div>
          </div>

          {/* Passenger – Charter Flights */}
          <div className="service-card">
            <div className="service-image">
              <img src={jet19} alt="Passenger Charter Flights" />
            </div>
            <div className="service-content">
              <h3>Passenger Charter Flights</h3>
              <p>
                Comfortable and reliable passenger charter services for business,
                leisure, and special travel needs—designed for flexibility,
                privacy, and efficiency.
              </p>
              <div className="service-cta">
                <a href="/services">View Services <span>→</span></a>
              </div>
            </div>
          </div>

          {/* Tracking – Cargo & Passenger */}
          <div className="service-card">
            <div className="service-image">
              <img src={jet5} alt="Real-time Tracking" />
            </div>
            <div className="service-content">
              <h3>Real-Time Cargo & Flight Tracking</h3>
              <p>
                Track your cargo shipments or passenger flights in real time
                using your Airway Bill or flight reference number—anytime,
                anywhere.
              </p>
              <div className="service-cta">
                <a href="/services">View Services <span>→</span></a>
              </div>
            </div>
          </div>

          {/* Logistics – End-to-End */}
          <div className="service-card">
            <div className="service-image">
              <img src={jet4} alt="End-to-End Logistics" />
            </div>
            <div className="service-content">
              <h3>End-to-End Logistics Solutions</h3>
              <p>
                From pickup to final delivery, we provide integrated logistics
                solutions combining air transport, storage, tracking, and
                customs expertise.
              </p>
              <div className="service-cta">
                <a href="/services">View Services <span>→</span></a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
