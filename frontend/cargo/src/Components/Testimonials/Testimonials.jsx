import React, { useRef, useState, useEffect } from 'react';
import './Testimonials.css';
import next_icon from '../../assets/next-icon.png';
import back_icon from '../../assets/back-icon.png';
import user_1 from '../../assets/user-1.png';
import user_2 from '../../assets/user-2.png';
import user_3 from '../../assets/user-3.png';
import user_4 from '../../assets/user-4.png';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Logistics Manager",
      company: "Global Imports Inc.",
      image: user_1,
      text: "CargoCharter has transformed our supply chain with their reliable air freight services. Their team is professional and always ensures our shipments arrive on time, even with tight deadlines."
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Supply Chain Director",
      company: "TechSolutions Ltd.",
      image: user_2,
      text: "The real-time tracking system is exceptional. We always know exactly where our high-value electronics are during transit, which gives us and our clients complete peace of mind."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Operations Manager",
      company: "PharmaCare International",
      image: user_3,
      text: "Their temperature-controlled shipping services are perfect for our pharmaceutical products. We've never had an issue with product integrity during transport."
    },
    {
      id: 4,
      name: "David Kimani",
      position: "Export Coordinator",
      company: "Nairobi Exporters Group",
      image: user_4,
      text: "As a Kenyan business, having a reliable partner like CargoCharter with both local presence and global reach has been instrumental in expanding our export markets."
    },
    {
      id: 5,
      name: "James Wilson",
      position: "Procurement Head",
      company: "Automotive Parts Ltd.",
      image: user_1,
      text: "Their customs clearance team handles all the complexities seamlessly. We've reduced our clearance time by 40% since switching to CargoCharter."
    },
    {
      id: 6,
      name: "Lisa Thompson",
      position: "E-commerce Director",
      company: "StyleTrend Fashion",
      image: user_2,
      text: "Fast fashion requires faster logistics. CargoCharter's expedited shipping options have helped us maintain our 3-day delivery promise to customers across continents."
    },
    {
      id: 7,
      name: "Robert Okello",
      position: "Agricultural Exporter",
      company: "FreshHarvest Kenya",
      image: user_3,
      text: "Our perishable goods arrive fresher than ever thanks to CargoCharter's specialized handling and optimal routing. Customer complaints have dropped significantly."
    },
    {
      id: 8,
      name: "Amanda Williams",
      position: "CEO",
      company: "Precision Instruments Corp",
      image: user_4,
      text: "The white-glove service for our sensitive equipment is worth every penny. Their team treats our shipments with the care we would ourselves."
    }
  ];

  // Auto-play functionality with slow transition
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        slideForward();
      }, 50000); // 50 seconds for slower transition
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  const slideForward = () => {
    if (currentSlide < testimonials.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const slideBackward = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      setCurrentSlide(testimonials.length - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>What Our Clients Say</h2>
          <p>Trusted by businesses worldwide for reliable air cargo solutions</p>
        </div>

        <div className="testimonials-slider">
          <div className="slider-controls">
            <button className="control-btn" onClick={slideBackward}>
              <img src={back_icon} alt="Previous" />
            </button>
            
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">{testimonials[currentSlide].text}</p>
              <div className="user-info">
                <img src={testimonials[currentSlide].image} alt={testimonials[currentSlide].name} />
                <div>
                  <h3>{testimonials[currentSlide].name}</h3>
                  <span>{testimonials[currentSlide].position}</span>
                  <p className="company">{testimonials[currentSlide].company}</p>
                </div>
              </div>
            </div>
            
            <button className="control-btn" onClick={slideForward}>
              <img src={next_icon} alt="Next" />
            </button>
          </div>

          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;