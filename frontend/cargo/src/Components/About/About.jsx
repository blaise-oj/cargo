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
    console.log("Play button clicked - would open video modal");
  };

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, [isVisible]);

  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-content">

          {/* Image */}
          <div className="about-image-container">
            <img
              src={jet15}
              alt="Air cargo and passenger aircraft"
              className="about-img"
            />
            <div
              className={`play-icon-container ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlayClick}
            >
              <img src={play_icon} alt="Play company video" className="play-icon" />
              <div className="pulse-ring"></div>
              <div className="pulse-ring delay"></div>
            </div>
          </div>

          {/* Text */}
          <div className="about-text">
            <h2>About Airrush Charters</h2>

            <div className="about-description">
              <p>
                Airrush Charters is a trusted aviation partner, delivering
                world-class air cargo logistics and premium passenger
                charter services across international destinations. By combining
                operational excellence, cutting-edge tracking technology,
                and a global network, we ensure every shipment and flight
                reaches its destination safely and on schedule.
              </p>

              <p>
                From time-critical cargo and specialized freight to flexible
                passenger travel solutions, our experienced team crafts tailored
                aviation services that prioritize safety, speed, and transparency.
                With real-time tracking, professional customs handling, and
                dedicated support, we make air transport seamless and reliable.
              </p>
            </div>

            {/* Stats */}
            <div className="about-stats" ref={statsRef}>
              <div className="stat">
                <AnimatedNumber value={15} isVisible={isVisible} suffix="+" />
                <p>Years of Aviation Experience</p>
              </div>

              <div className="stat">
                <AnimatedNumber value={500} isVisible={isVisible} suffix="+" />
                <p>Global Routes & Destinations</p>
              </div>

              <div className="stat">
                <AnimatedNumber value={98} isVisible={isVisible} suffix="%" />
                <p>On-Time Cargo & Flight Performance</p>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="about-mv">
              <div className="mv-box">
                <h3>Our Mission</h3>
                <p>
                  To provide reliable, secure, and efficient air cargo and passenger
                  transport solutions, leveraging advanced aviation technology
                  and expert logistics, while exceeding customer expectations
                  every step of the way.
                </p>
              </div>

              <div className="mv-box">
                <h3>Our Vision</h3>
                <p>
                  To become a globally trusted leader in aviation and logistics,
                  redefining air cargo and passenger transport through innovation,
                  operational excellence, and unmatched customer focus.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button className="about-btn">
              <span>Discover Our Services</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

// AnimatedNumber component
const AnimatedNumber = ({ value, isVisible, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const duration = 2000;

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    }
  }, [isVisible, value, hasAnimated]);

  return <h3>{count}{suffix}</h3>;
};

export default About;

