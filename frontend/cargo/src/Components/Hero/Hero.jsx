import React from 'react'
import './Hero.css'
import dark_arrow from '../../assets/dark-arrow.png'

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
          <button className="btn" onClick={scrollToServices}>
            Explore more <img src={dark_arrow} alt="" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
