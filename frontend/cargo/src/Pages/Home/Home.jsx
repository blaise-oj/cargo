// src/Pages/Home/Home.jsx
import React from "react";
import Hero from "../../Components/Hero/Hero";
import Services from "../../Components/Services/Services";
import About from "../../Components/About/About";
import Destinations from "../../Components/Destinations/Destinations";
import Testimonials from "../../Components/Testimonials/Testimonials";

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Destinations />
      <Testimonials />
    </>
  );
};

export default Home;
