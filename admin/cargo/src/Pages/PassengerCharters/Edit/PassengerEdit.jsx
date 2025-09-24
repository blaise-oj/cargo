import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city";
import "./PassengerEdit.css";
import { API_URL } from "../../../config/api.js";


const emptyPassenger = {
  name: "",
  passportNo: "",
  idNo: "",
  seatNo: "",
  age: "",
  gender: "Other",
};

const PassengerEdit = () => {
  const { airwaybill } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    ticketClass: "Economy",
    originCountry: "",
    originCity: "",
    destinationCountry: "",
    destinationCity: "",
    currentCountry: "",
    currentCity: "",
    status: "Booked",
    price: "",
    departureDate: "",
    arrivalDate: "",
    specialRequests: "",
    passengerList: [emptyPassenger],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Extract country ISO code from displayName like "Brasília, BR"
  const getCountryCodeFromDisplayName = (displayName) => {
    if (!displayName) return "";
    const parts = displayName.split(",").map((p) => p.trim());
    const code = parts[parts.length - 1];
    return Country.getAllCountries().some((c) => c.isoCode === code) ? code : "";
  };

  // Fetch passenger data from API
  useEffect(() => {
    const fetchPassenger = async () => {
      try {
        const res = await fetch(
          `${API_URL}/passengers/track/${airwaybill}`
        );
        const data = await res.json();

        if (data.success) {
          const p = data.data;

          setFormData({
            customerName: p.customerName || "",
            customerEmail: p.customerEmail || "",
            phone: p.phone || "",
            ticketClass: p.ticketClass || "Economy",
            originCountry: getCountryCodeFromDisplayName(p.origin?.displayName),
            originCity: p.origin?.city || "",
            destinationCountry: getCountryCodeFromDisplayName(
              p.destination?.displayName
            ),
            destinationCity: p.destination?.city || "",
            currentCountry: getCountryCodeFromDisplayName(
              p.currentLocation?.displayName
            ),
            currentCity: p.currentLocation?.city || "",
            status: p.status || "Booked",
            price: p.price || "",
            departureDate: p.departureDate
              ? new Date(p.departureDate).toISOString().slice(0, 16)
              : "",
            arrivalDate: p.arrivalDate
              ? new Date(p.arrivalDate).toISOString().slice(0, 16)
              : "",
            specialRequests: p.specialRequests || "",
            passengerList: p.passengerDetails?.passengerList?.length
              ? p.passengerDetails.passengerList
              : [emptyPassenger],
          });
        } else setError("Passenger not found");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch passenger data");
      } finally {
        setLoading(false);
      }
    };

    fetchPassenger();
  }, [airwaybill]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePassengerChange = (i, e) => {
    const list = [...formData.passengerList];
    list[i][e.target.name] = e.target.value;
    setFormData({ ...formData, passengerList: list });
  };

  const addPassenger = () =>
    setFormData({
      ...formData,
      passengerList: [...formData.passengerList, { ...emptyPassenger }],
    });

  const removePassenger = (i) =>
    setFormData({
      ...formData,
      passengerList: formData.passengerList.filter((_, idx) => idx !== i),
    });

  // Create location object; fallback to db values if city not in library
  const makeLocation = (countryCode, cityName, fallbackDisplayName = "") => {
    if (!countryCode || !cityName) return null;

    const cityObj = City.getCitiesOfCountry(countryCode)?.find(
      (c) => c.name === cityName
    );

    if (cityObj) {
      return {
        city: cityObj.name,
        coordinates: {
          lat: parseFloat(cityObj.latitude),
          lng: parseFloat(cityObj.longitude),
        },
        displayName: `${cityObj.name}, ${
          Country.getCountryByCode(countryCode)?.name || ""
        }`,
      };
    }

    // fallback if city not found
    return {
      city: cityName,
      coordinates: { lat: 0, lng: 0 },
      displayName:
        fallbackDisplayName ||
        `${cityName}, ${Country.getCountryByCode(countryCode)?.name || ""}`,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const origin = makeLocation(
      formData.originCountry,
      formData.originCity,
      formData.originCity
    );
    const destination = makeLocation(
      formData.destinationCountry,
      formData.destinationCity,
      formData.destinationCity
    );
    const currentLocation = makeLocation(
      formData.currentCountry,
      formData.currentCity,
      formData.currentCity
    );

    const safePassengerList = formData.passengerList.map((p) => ({
      name: p.name?.trim() || "Passenger",
      passportNo: p.passportNo?.trim() || "UNKNOWN",
      idNo: p.idNo?.trim() || "",
      seatNo: p.seatNo?.trim() || "",
      age: p.age ? Number(p.age) : null,
      gender: p.gender?.trim() || "Other",
    }));

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      phone: formData.phone || null,
      ticketClass: formData.ticketClass,
      origin,
      destination,
      currentLocation,
      status: formData.status,
      price: parseFloat(formData.price) || 0,
      departureDate: formData.departureDate
        ? new Date(formData.departureDate).toISOString()
        : null,
      arrivalDate: formData.arrivalDate
        ? new Date(formData.arrivalDate).toISOString()
        : null,
      specialRequests: formData.specialRequests || null,
      passengerDetails: {
        numberOfPassengers: safePassengerList.length,
        passengerList: safePassengerList,
      },
    };

    try {
      const res = await fetch(
        `${API_URL}/passengers/track/${airwaybill}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      const data = await res.json();
      alert(
        `✅ Passenger updated! Current location: ${
          data.data.currentLocation?.city || "Not set"
        }`
      );
      navigate("/passengercharters");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this passenger?")) return;
    try {
      const res = await fetch(
        `${API_URL}/passengers/track/${airwaybill}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      alert("Passenger deleted!");
      navigate("/passengercharters");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Render cities with unique keys
  const renderCityOptions = (countryCode) =>
    City.getCitiesOfCountry(countryCode)?.map((city) => (
      <option
        key={`${city.name}-${city.latitude}-${city.longitude}`}
        value={city.name}
      >
        {city.name}
      </option>
    ));

  return (
    <div className="passenger-edit">
      <h2>Edit Passenger Airwaybill {airwaybill}</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        {/* Customer Info */}
        <label>Customer Name</label>
        <input
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          required
        />
        <label>Phone</label>
        <input name="phone" value={formData.phone} onChange={handleChange} />
        <label>Ticket Class</label>
        <select
          name="ticketClass"
          value={formData.ticketClass}
          onChange={handleChange}
        >
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
          <option value="First">First</option>
        </select>

        {/* Origin */}
        <label>Origin Country</label>
        <select
          name="originCountry"
          value={formData.originCountry}
          onChange={(e) =>
            setFormData({
              ...formData,
              originCountry: e.target.value,
              originCity: "",
            })
          }
        >
          <option value="">Select Country</option>
          {Country.getAllCountries().map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
        <label>Origin City</label>
        <select
          name="originCity"
          value={formData.originCity}
          onChange={handleChange}
          disabled={!formData.originCountry}
        >
          <option value="">Select City</option>
          {formData.originCountry && renderCityOptions(formData.originCountry)}
        </select>

        {/* Destination */}
        <label>Destination Country</label>
        <select
          name="destinationCountry"
          value={formData.destinationCountry}
          onChange={(e) =>
            setFormData({
              ...formData,
              destinationCountry: e.target.value,
              destinationCity: "",
            })
          }
        >
          <option value="">Select Country</option>
          {Country.getAllCountries().map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
        <label>Destination City</label>
        <select
          name="destinationCity"
          value={formData.destinationCity}
          onChange={handleChange}
          disabled={!formData.destinationCountry}
        >
          <option value="">Select City</option>
          {formData.destinationCountry &&
            renderCityOptions(formData.destinationCountry)}
        </select>

        {/* Current Location */}
        <label>Current Location Country</label>
        <select
          name="currentCountry"
          value={formData.currentCountry}
          onChange={(e) =>
            setFormData({
              ...formData,
              currentCountry: e.target.value,
              currentCity: "",
            })
          }
        >
          <option value="">Select Country</option>
          {Country.getAllCountries().map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
        <label>Current Location City</label>
        <select
          name="currentCity"
          value={formData.currentCity}
          onChange={handleChange}
          disabled={!formData.currentCountry}
        >
          <option value="">Select City</option>
          {formData.currentCountry &&
            renderCityOptions(formData.currentCountry)}
        </select>

        {/* Status, Price, Dates, Special Requests */}
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Booked">Booked</option>
          <option value="Checked In">Checked In</option>
          <option value="In Transit">In Transit</option>
          <option value="Arrived">Arrived</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <label>Price</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
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
        <label>Special Requests</label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
        />

        {/* Passenger List */}
        <h3>Passenger List</h3>
        {formData.passengerList.map((p, i) => (
          <div key={i} className="passenger-row">
            <input
              name="name"
              placeholder="Full Name"
              value={p.name}
              onChange={(e) => handlePassengerChange(i, e)}
              required
            />
            <input
              name="passportNo"
              placeholder="Passport No"
              value={p.passportNo}
              onChange={(e) => handlePassengerChange(i, e)}
            />
            <input
              name="idNo"
              placeholder="ID No"
              value={p.idNo}
              onChange={(e) => handlePassengerChange(i, e)}
            />
            <input
              name="seatNo"
              placeholder="Seat No"
              value={p.seatNo}
              onChange={(e) => handlePassengerChange(i, e)}
            />
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={p.age}
              onChange={(e) => handlePassengerChange(i, e)}
            />
            <select
              name="gender"
              value={p.gender}
              onChange={(e) => handlePassengerChange(i, e)}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <button type="button" onClick={() => removePassenger(i)}>
              ❌
            </button>
          </div>
        ))}

        <button type="button" onClick={addPassenger}>
          + Add Passenger
        </button>

        <div className="edit-actions">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/passengercharters")}
          >
            Back
          </button>
          <button type="submit" className="save-btn">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="delete-btn-container">
        <button type="button" className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default PassengerEdit;

