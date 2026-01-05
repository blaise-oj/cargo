import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/Home/Home";
import PassengerCharters from "./Pages/PassengerCharters/PassengerCharters";
import CargoCharters from "./Pages/CargoCharters/CargoCharters";
import ServicesPage from "./Pages/ServicesPage/ServicesPage";
import Contact from "./Pages/Contact/Contact";
import LoginForm from "./Pages/Login/Login";
import RegisterForm from "./Pages/Register/Register";
import ScrollMemory from "./Components/ScrollMemory/ScrollMemory";

const App = () => {
  return (
    <>
      <ScrollMemory /> {/* store & restore scroll per page */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/passenger-charters" element={<PassengerCharters />} />
        <Route path="/cargo-charters" element={<CargoCharters />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
