import React from 'react';
import './Services.css';
import jet2 from '../../assets/jet2.png';
import jet11 from '../../assets/jet11.png';
import jet6 from '../../assets/jet6.png';
import jet19 from '../../assets/jet19.png';
import jet5 from '../../assets/jet5.png';
import jet4 from '../../assets/jet4.png';
import jet3 from '../../assets/jet3.png';

const Services = () => {
  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2>Our Premium Air Cargo Services</h2>
          <p>Fast, reliable, and secure air freight solutions for your business needs</p>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-image">
              <img src={jet2} alt="Worldwide Shipping" />
            </div>
            <div className="service-content">
              <h3>Worldwide Shipping</h3>
              <p>We offer reliable and efficient worldwide shipping services to meet your business needs.</p>
              <div className="service-cta">
                <a href="#worldwide">Learn More <span>→</span></a>
              </div>
            </div>
          </div>
          
          <div className="service-card">
            <div className="service-image">
              <img src={jet11} alt="Customs Clearance" />
            </div>
            <div className="service-content">
              <h3>Customs Clearance</h3>
              <p>Our team of experts will handle all customs documentation and procedures to ensure smooth delivery.</p>
              <div className="service-cta">
                <a href="#customs">Learn More <span>→</span></a>
              </div>
            </div>
          </div>
          
          <div className="service-card">
            <div className="service-image">
              <img src={jet6} alt="Warehousing Solutions" />
            </div>
            <div className="service-content">
              <h3>Warehousing Solutions</h3>
              <p>We provide secure and flexible warehousing solutions to store your goods before delivery.</p>
              <div className="service-cta">
                <a href="#warehousing">Learn More <span>→</span></a>
              </div>
            </div>
          </div>
          
          <div className="service-card">
            <div className="service-image">
              <img src={jet5} alt="Real-time Tracking" />
            </div>
            <div className="service-content">
              <h3>Real-time Tracking</h3>
              <p>Stay informed with our real-time tracking system that allows you to monitor your shipments at any time.</p>
              <div className="service-cta">
                <a href="#tracking">Learn More <span>→</span></a>
              </div>
            </div>
          </div>
          <div className="service-card">
            <div className="service-image">
              <img src={jet4} alt="Real-time Tracking" />
            </div>
            <div className="service-content">
              <h3>Real-time Tracking</h3>
              <p>Stay informed with our real-time tracking system that allows you to monitor your shipments at any time.</p>
              <div className="service-cta">
                <a href="#tracking">Learn More <span>→</span></a>
              </div>
            </div>
          </div>
          <div className="service-card">
            <div className="service-image">
              <img src={jet3} alt="Real-time Tracking" />
            </div>
            <div className="service-content">
              <h3>Real-time Tracking</h3>
              <p>Stay informed with our real-time tracking system that allows you to monitor your shipments at any time.</p>
              <div className="service-cta">
                <a href="#tracking">Learn More <span>→</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;