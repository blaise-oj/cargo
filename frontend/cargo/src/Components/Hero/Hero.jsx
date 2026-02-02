import React from 'react';
import './Hero.css';
import dark_arrow from '../../assets/dark-arrow.png';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToServices = () => {
    const section = document.getElementById('home-services');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <h1>AIRRUSH CHARTERS</h1>
          <p>Your Trusted Partner in Air Freight and Charter Services</p>

          {/* Buttons stacked vertically */}
          <div className="hero-buttons">
            <button className="btn" onClick={scrollToServices}>
              Explore more <img src={dark_arrow} alt="" />
            </button>

            <Link
              to="/cargo-charters"
              className="btn track-btn"
              style={{
                marginTop: '15px',        // space below the previous button
                backgroundColor: '#fff',
                color: '#000',
                textDecoration: 'none',
                display: 'block',          // stacked below the first button
                textAlign: 'center',
                padding: '12px 25px',
                borderRadius: '30px',
                width: '160px',            // shorter than before
                marginLeft: 'auto',        // centers the button
                marginRight: 'auto',
              }}

            >
              Track Your Cargo
            </Link>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Hero;
