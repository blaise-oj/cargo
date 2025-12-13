import React, { useState } from 'react';
import './Destinations.css';
import jet23 from '../../assets/jet23.jpg';
import jet8 from '../../assets/jet8.png';
import jet14 from '../../assets/jet14.png';

const Destinations = () => {
  const [activeCard, setActiveCard] = useState(null);

  const destinations = [
    {
      id: 1,
      title: "South Africa Headquarters",
      location: "Cape Town, SOUTH AFRICA",
      description: "Our global headquarters managing worldwide operations and strategic planning.",
      image: jet23,
      details: "Strategic planning center with state-of-the-art logistics technology and executive team."
    },
    {
      id: 2,
      title: "Kenya Operations Base",
      location: "JKIA North Wing, Nairobi",
      description: "Our main operational hub for African and international cargo services.",
      image: jet8,
      details: "Primary operational base with 24/7 cargo handling facilities and customs clearance services."
    },
    {
      id: 3,
      title: "Global Network",
      location: "Worldwide Coverage",
      description: "Extensive international routes connecting major cities across continents.",
      image: jet14,
      details: "Comprehensive air cargo network with partnerships in over 50 countries worldwide."
    }
  ];

  const handleCardHover = (id) => {
    setActiveCard(id);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

  return (
    <section className="destinations-section">
      <div className="destinations-container">
        <div className="destinations-header">
          <h2>Explore Our Global Destinations</h2>
          <p>Connecting You to Major Cities Worldwide with Our Extensive Air Cargo Network</p>
        </div>

        <div className="destinations-content">
          <div className="destinations-cards">
            {destinations.map((destination) => (
              <div 
                key={destination.id}
                className={`destination-card ${activeCard === destination.id ? 'active' : ''}`}
                onMouseEnter={() => handleCardHover(destination.id)}
                onMouseLeave={handleCardLeave}
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
                    <button className="card-btn">Learn More</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="destinations-cta">
            <button className="cta-btn">
              View All Destinations
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
