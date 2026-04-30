import React, { useEffect, useState } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";

import hero1 from "../../assets/hero1.png";
import hero2 from "../../assets/jetj.png";
import hero3 from "../../assets/jetk.png";

const Hero = () => {

  const slides = [
    {
      image: hero1,
      title: "Airush Charters - Global Air Freight Solutions",
      text: "Fast, secure and reliable cargo delivery across international destinations with real-time tracking.",
    },
    {
      image: hero2,
      title: "Private & Cargo Charters",
      text: "Flexible charter solutions tailored for urgent logistics, executive travel and specialized cargo.",
      highlights: [
        "On-demand aircraft, Priority scheduling, Global coverage"
      ]
    },
    {
      image: hero3,
      title: "Precision Logistics & Handling",
      text: "End-to-end cargo management with expert handling, customs support and secure delivery.",
    }
  ];

  const [current, setCurrent] = useState(0);

  const SLIDE_DURATION = 15000; // 15 seconds

  // ✅ BEST APPROACH
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(timeout);
  }, [current, slides.length]);

  const slide = slides[current];

  return (
    <section
      className="airrush-hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${slide.image})`,
      }}
    >

      <div className="hero-content">

        <div className="hero-text">

          <h1 key={slide.title}>{slide.title}</h1>

          <p key={slide.text}>{slide.text}</p>

          {slide.highlights && (
            <ul className="hero-list">
              {slide.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          <div className="hero-buttons">
            <Link to="/cargo-charters" className="btn primary">
              Track Cargo
            </Link>

            <Link to="/passenger-charters" className="btn secondary">
              Book a Charter
            </Link>
          </div>

        </div>

      </div>

      {/* DOT NAVIGATION */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === current ? "dot active" : "dot"}
            onClick={() => setCurrent(i)}
          ></span>
        ))}
      </div>

    </section>
  );
};

export default Hero;