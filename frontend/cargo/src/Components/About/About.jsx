import React, { useState, useEffect, useRef } from 'react';
import './About.css';
import play_icon from '../../assets/play-icon.png';
import jet15 from '../../assets/jet15.png';

const About = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    // Here you would typically trigger a video modal
    console.log("Play button clicked - would open video modal");
  };

  // Set up Intersection Observer to detect when stats section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Only trigger when the element becomes visible
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px' // Trigger when 100px from bottom of viewport
      }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [isVisible]); // Add isVisible as dependency

  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-content">
          <div className="about-image-container">
            <img 
              src={jet15} 
              alt="Air cargo plane" 
              className='about-img' 
            />
            <div 
              className={`play-icon-container ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlayClick}
            >
              <img src={play_icon} alt="Play video" className='play-icon' />
              <div className="pulse-ring"></div>
              <div className="pulse-ring delay"></div>
            </div>
          </div>
          
          <div className="about-text">
            <h2>About Our Air Cargo Services</h2>
            <div className="about-description">
              <p>We are a leading air cargo service provider, committed to delivering excellence in every shipment. With a global network and state-of-the-art technology, we ensure your goods reach their destination safely and on time.</p>
              <p>Our team of experienced professionals is dedicated to providing personalized solutions tailored to your specific needs. From customs clearance to real-time tracking, we offer a comprehensive range of services to make your shipping experience seamless and hassle-free.</p>
            </div>
            <div className="about-stats" ref={statsRef}>
              <div className="stat">
                <AnimatedNumber value={15} isVisible={isVisible} suffix="+" />
                <p>Years of Experience</p>
              </div>
              <div className="stat">
                <AnimatedNumber value={500} isVisible={isVisible} suffix="+" />
                <p>Global Destinations</p>
              </div>
              <div className="stat">
                <AnimatedNumber value={98} isVisible={isVisible} suffix="%" />
                <p>On-Time Delivery</p>
              </div>
            </div>
            <button className='about-btn'>
              <span>Learn More</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// AnimatedNumber component for counting up
const AnimatedNumber = ({ value, isVisible, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const duration = 2000; // Animation duration in ms

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * value));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isVisible, value, hasAnimated]);

  return <h3>{count}{suffix}</h3>;
};

export default About;