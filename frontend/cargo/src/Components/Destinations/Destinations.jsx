import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Destinations.css';
import jet23 from '../../assets/jet23.jpg';
import jet8 from '../../assets/jet8.png';
import jet14 from '../../assets/jet14.png';
import h8 from '../../assets/h8.png';
import h9 from '../../assets/h9.png';

const Destinations = () => {
  const [activeCard, setActiveCard] = useState(null);

  const destinations = [
    {
      id: 1,
      title: "South Africa Headquarters",
      location: "Cape Town, SOUTH AFRICA",
      description:
        "Our corporate headquarters overseeing global operations and strategic initiatives.",
      image: h9,
      details:
        "The strategic hub for executive management, global planning, and innovative logistics solutions, equipped with advanced communication and tracking systems to coordinate worldwide operations efficiently."
    },
    {
      id: 2,
      title: "Kenya Operations Base",
      location: "JKIA North Wing, Nairobi",
      description:
        "Primary operational center facilitating African and international cargo services.",
      image: h8,
      details:
        "A fully equipped operations base featuring 24/7 cargo handling, customs clearance support, and state-of-the-art aviation facilities, ensuring reliable, timely, and secure transport of goods across regional and international routes."
    },
    {
      id: 3,
      title: "Global Network",
      location: "Worldwide Coverage",
      description:
        "Comprehensive international air cargo network connecting major global cities.",
      image: jet14,
      details:
        "Our extensive global network spans over 50 countries, providing seamless logistics solutions, partnerships with leading carriers, and integrated tracking systems to guarantee efficiency, transparency, and on-time delivery for clients worldwide."
    }
  ];

  return (
    <section className="destinations-section">
      <div className="destinations-container">

        {/* Header */}
        <div className="destinations-header">
          <h2>Explore Our Global Destinations</h2>
          <p>
            Airrush Charters connects businesses and travelers to key cities across
            the globe, leveraging a highly reliable and efficient air cargo network
            designed for maximum reach and operational excellence.
          </p>
        </div>

        <div className="destinations-content">
          <div className="destinations-cards">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className={`destination-card ${activeCard === destination.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveCard(destination.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="card-image">
                  <img src={destination.image} alt={destination.title} />
                  <div className="card-overlay"></div>
                  <div className="location-marker">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                </div>

                <div className="card-content">
                  <h3>{destination.title}</h3>
                  <p className="location">{destination.location}</p>
                  <p className="description">{destination.description}</p>

                  <div className={`card-details ${activeCard === destination.id ? 'visible' : ''}`}>
                    <p>{destination.details}</p>

                    {/* Link instead of button */}
                    <Link to="/services" className="card-btn">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="destinations-cta">
            <Link to="/services" className="cta-btn">
              View All Destinations
              <span className="btn-arrow">→</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Destinations;

