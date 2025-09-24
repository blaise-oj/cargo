import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PassengerCreate.css";
import countries from "world-countries";
import { City } from "country-state-city";

const PassengerCreate = () => {
  const navigate = useNavigate();

  const emptyPassenger = {
    name: "",
    passportNo: "",
    idNo: "",
    seatNo: "",
    age: "",
    gender: "Other",
  };

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    originCountry: "",
    origin: "",
    destinationCountry: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    price: "",
    ticketClass: "Economy",
    specialRequests: "",
    passengerList: [emptyPassenger],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePassengerChange = (index, e) => {
    const updatedPassengers = [...formData.passengerList];
    updatedPassengers[index][e.target.name] = e.target.value;
    setFormData({ ...formData, passengerList: updatedPassengers });
  };

  const addPassenger = () => {
    setFormData({
      ...formData,
      passengerList: [...formData.passengerList, { ...emptyPassenger }],
    });
  };

  const removePassenger = (index) => {
    const updatedPassengers = formData.passengerList.filter((_, i) => i !== index);
    setFormData({ ...formData, passengerList: updatedPassengers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Resolve origin city
    const originCityObj = formData.originCountry
      ? City.getCitiesOfCountry(formData.originCountry)?.find(
          (c) => c.name === formData.origin
        )
      : null;

    const destinationCityObj = formData.destinationCountry
      ? City.getCitiesOfCountry(formData.destinationCountry)?.find(
          (c) => c.name === formData.destination
        )
      : null;

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      phone: formData.phone || null,
      origin: originCityObj
        ? {
            city: originCityObj.name,
            coordinates: {
              lat: parseFloat(originCityObj.latitude),
              lng: parseFloat(originCityObj.longitude),
            },
            displayName: `${originCityObj.name}, ${formData.originCountry}`,
          }
        : null,
      destination: destinationCityObj
        ? {
            city: destinationCityObj.name,
            coordinates: {
              lat: parseFloat(destinationCityObj.latitude),
              lng: parseFloat(destinationCityObj.longitude),
            },
            displayName: `${destinationCityObj.name}, ${formData.destinationCountry}`,
          }
        : null,
      departureDate: formData.departureDate || null,
      arrivalDate: formData.arrivalDate || null,
      price: parseFloat(formData.price) || 0,
      ticketClass: formData.ticketClass,
      specialRequests: formData.specialRequests || null,
      passengerDetails: {
        numberOfPassengers: formData.passengerList.length,
        passengerList: formData.passengerList.map((p) => ({
          ...p,
          passportNo: p.passportNo || "UNKNOWN",
          gender: p.gender || "Other",
        })),
      },
    };

    try {
      const res = await fetch("http://localhost:4000/api/passengers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create passenger airwaybill");
      }

      const data = await res.json();
      alert(`✅ Passenger airwaybill created: ${data.data.airwaybill}`);

      setFormData({
        customerName: "",
        customerEmail: "",
        phone: "",
        originCountry: "",
        origin: "",
        destinationCountry: "",
        destination: "",
        departureDate: "",
        arrivalDate: "",
        price: "",
        ticketClass: "Economy",
        specialRequests: "",
        passengerList: [emptyPassenger],
      });

      navigate("/passengercharters");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passenger-create">
      <h2>Create Passenger Airwaybill</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="create-form">
        <label>Customer Name</label>
        <input
          name="customerName"
          placeholder="Enter full name"
          value={formData.customerName}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="customerEmail"
          placeholder="Enter email"
          value={formData.customerEmail}
          onChange={handleChange}
          required
        />

        <label>Phone</label>
        <input
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        {/* Origin */}
        <label>Origin Country</label>
        <select
          name="originCountry"
          value={formData.originCountry}
          onChange={(e) =>
            setFormData({ ...formData, originCountry: e.target.value, origin: "" })
          }
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.cca2} value={c.cca2}>
              {c.name.common}
            </option>
          ))}
        </select>

        <label>Origin City</label>
        <select
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          disabled={!formData.originCountry}
        >
          <option value="">Select City</option>
          {formData.originCountry &&
            City.getCitiesOfCountry(formData.originCountry)?.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
        </select>

        {/* Destination */}
        <label>Destination Country</label>
        <select
          name="destinationCountry"
          value={formData.destinationCountry}
          onChange={(e) =>
            setFormData({ ...formData, destinationCountry: e.target.value, destination: "" })
          }
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.cca2} value={c.cca2}>
              {c.name.common}
            </option>
          ))}
        </select>

        <label>Destination City</label>
        <select
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          disabled={!formData.destinationCountry}
        >
          <option value="">Select City</option>
          {formData.destinationCountry &&
            City.getCitiesOfCountry(formData.destinationCountry)?.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
        </select>

        {/* Dates & price */}
        <label>Departure Date</label>
        <input
          type="datetime-local"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
        />

        <label>Arrival Date</label>
        <input
          type="datetime-local"
          name="arrivalDate"
          value={formData.arrivalDate}
          onChange={handleChange}
        />

        <label>Price</label>
        <input
          type="number"
          name="price"
          placeholder="Enter price"
          value={formData.price}
          onChange={handleChange}
        />

        <label>Ticket Class</label>
        <select name="ticketClass" value={formData.ticketClass} onChange={handleChange}>
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
          <option value="First">First</option>
        </select>

        <label>Special Requests</label>
        <textarea
          name="specialRequests"
          placeholder="Meals, wheelchair support, etc."
          value={formData.specialRequests}
          onChange={handleChange}
        />

        <h3>Passenger List</h3>
        {formData.passengerList.map((passenger, index) => (
          <div key={index} className="passenger-row">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Passenger full name"
              value={passenger.name}
              onChange={(e) => handlePassengerChange(index, e)}
            />

            <label>Passport Number</label>
            <input
              name="passportNo"
              placeholder="Passport No"
              value={passenger.passportNo}
              onChange={(e) => handlePassengerChange(index, e)}
            />

            <label>ID Number</label>
            <input
              name="idNo"
              placeholder="ID No"
              value={passenger.idNo}
              onChange={(e) => handlePassengerChange(index, e)}
            />

            <label>Seat Number</label>
            <input
              name="seatNo"
              placeholder="Seat No"
              value={passenger.seatNo}
              onChange={(e) => handlePassengerChange(index, e)}
            />

            <label>Age</label>
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={passenger.age}
              onChange={(e) => handlePassengerChange(index, e)}
            />

            <label>Gender</label>
            <select
              name="gender"
              value={passenger.gender}
              onChange={(e) => handlePassengerChange(index, e)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <button type="button" onClick={() => removePassenger(index)}>
              ❌ Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addPassenger}>
          + Add Passenger
        </button>

        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Airwaybill"}
        </button>
      </form>
    </div>
  );
};

export default PassengerCreate;
