import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city";
import "./CargoEdit.css";

const emptyCargoDetails = { weight: 0, quantity: 0, description: "" };

const CargoEdit = () => {
  const { airwaybill } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);

  useEffect(() => {
    const fetchCargo = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/cargo/track/${airwaybill}`);
        const data = await res.json();
        if (!data.success || !data.cargo) throw new Error("No cargo data found");
        const cargo = data.cargo;

        setFormData({
          customerName: cargo.customerName || "",
          customerEmail: cargo.customerEmail || "",
          originCountry: cargo.origin?.country || "",
          originCity: cargo.origin?.city || "",
          destinationCountry: cargo.destination?.country || "",
          destinationCity: cargo.destination?.city || "",
          currentCountry: cargo.currentLocation?.country || cargo.origin?.country || "",
          currentCity: cargo.currentLocation?.city || cargo.origin?.city || "",
          cargoDetails: cargo.cargoDetails || { ...emptyCargoDetails },
          price: cargo.price || 0,
          departureDate: cargo.departureDate
            ? new Date(cargo.departureDate).toISOString().slice(0, 16)
            : "",
          arrivalDate: cargo.arrivalDate
            ? new Date(cargo.arrivalDate).toISOString().slice(0, 16)
            : "",
          withdrawnAt: cargo.withdrawnAt
            ? new Date(cargo.withdrawnAt).toISOString().slice(0, 16)
            : "",
          status: cargo.status || "Booked",
        });

        if (cargo.origin?.country) setOriginCities(City.getCitiesOfCountry(cargo.origin.country));
        if (cargo.destination?.country) setDestinationCities(City.getCitiesOfCountry(cargo.destination.country));
        if (cargo.currentLocation?.country) setCurrentCities(City.getCitiesOfCountry(cargo.currentLocation.country));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCargo();
  }, [airwaybill]);

  if (loading) return <p className="loading">Loading cargo data...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!formData) return <p className="error">No cargo data to edit</p>;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCountryChange = (type, countryCode) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}Country`]: countryCode,
      [`${type}City`]: "",
    }));

    const citiesList = City.getCitiesOfCountry(countryCode) || [];
    if (type === "origin") setOriginCities(citiesList);
    else if (type === "destination") setDestinationCities(citiesList);
    else if (type === "current") setCurrentCities(citiesList);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    let updated = { ...formData, status: newStatus };

    if (newStatus === "In Transit" && !formData.departureDate)
      updated.departureDate = new Date().toISOString().slice(0, 16);
    if (newStatus === "Arrived" && !formData.arrivalDate)
      updated.arrivalDate = new Date().toISOString().slice(0, 16);
    if (newStatus === "Withdrawn" && !formData.withdrawnAt)
      updated.withdrawnAt = new Date().toISOString().slice(0, 16);

    if (["Booked", "Checked In"].includes(newStatus)) {
      updated.currentCountry = updated.originCountry;
      updated.currentCity = updated.originCity;
    } else if (["Arrived", "Withdrawn"].includes(newStatus)) {
      updated.currentCountry = updated.destinationCountry;
      updated.currentCity = updated.destinationCity;
    }

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const originData = originCities.find(c => c.name === formData.originCity);
    const destinationData = destinationCities.find(c => c.name === formData.destinationCity);
    const currentData = currentCities.find(c => c.name === formData.currentCity);

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      origin: { country: formData.originCountry, city: formData.originCity, lat: originData?.latitude || 0, lng: originData?.longitude || 0 },
      destination: { country: formData.destinationCountry, city: formData.destinationCity, lat: destinationData?.latitude || 0, lng: destinationData?.longitude || 0 },
      currentLocation: { country: formData.currentCountry, city: formData.currentCity, lat: currentData?.latitude || 0, lng: currentData?.longitude || 0 },
      cargoDetails: {
        weight: parseFloat(formData.cargoDetails.weight) || 0,
        quantity: parseInt(formData.cargoDetails.quantity) || 0,
        description: formData.cargoDetails.description,
      },
      price: parseFloat(formData.price) || 0,
      departureDate: formData.departureDate || null,
      arrivalDate: formData.arrivalDate || null,
      withdrawnAt: formData.withdrawnAt || null,
      status: formData.status,
    };

    try {
      const res = await fetch(`http://localhost:4000/api/cargo/track/${airwaybill}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Cargo update failed");

      alert("✅ Cargo updated successfully");
      navigate("/cargocharters");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this cargo?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/cargo/${airwaybill}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("Cargo deleted!");
      navigate("/cargocharters");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDownloadReceipt = () => {
    window.open(`http://localhost:4000/api/cargo/${airwaybill}/receipt`, "_blank");
  };

  const renderCityOptions = (citiesList) =>
    citiesList.map((c) => (
      <option key={`${c.name}-${c.latitude}-${c.longitude}`} value={c.name}>{c.name}</option>
    ));

  return (
    <div className="cargo-edit-container">
      <h2>Edit Cargo Airwaybill <span>{airwaybill}</span></h2>
      <form onSubmit={handleSubmit} className="cargo-form">
        <div className="form-group">
          <label>Customer Name</label>
          <input name="customerName" value={formData.customerName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Customer Email</label>
          <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} required />
        </div>

        {/* Origin */}
        <div className="form-group">
          <label>Origin Country</label>
          <select value={formData.originCountry} onChange={(e) => handleCountryChange("origin", e.target.value)}>
            <option value="">Select Country</option>
            {Country.getAllCountries().map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Origin City</label>
          <select value={formData.originCity} onChange={(e) => setFormData({ ...formData, originCity: e.target.value })} disabled={!formData.originCountry}>
            <option value="">Select City</option>
            {renderCityOptions(originCities)}
          </select>
        </div>

        {/* Destination */}
        <div className="form-group">
          <label>Destination Country</label>
          <select value={formData.destinationCountry} onChange={(e) => handleCountryChange("destination", e.target.value)}>
            <option value="">Select Country</option>
            {Country.getAllCountries().map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Destination City</label>
          <select value={formData.destinationCity} onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })} disabled={!formData.destinationCountry}>
            <option value="">Select City</option>
            {renderCityOptions(destinationCities)}
          </select>
        </div>

        {/* Current Location */}
        <div className="form-group">
          <label>Current Country</label>
          <select value={formData.currentCountry} onChange={(e) => handleCountryChange("current", e.target.value)}>
            <option value="">Select Country</option>
            {Country.getAllCountries().map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Current City</label>
          <select value={formData.currentCity} onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })} disabled={!formData.currentCountry}>
            <option value="">Select City</option>
            {renderCityOptions(currentCities)}
          </select>
        </div>

        {/* Cargo Details */}
        <div className="form-group">
          <label>Weight (kg)</label>
          <input type="number" value={formData.cargoDetails.weight} onChange={(e) => setFormData({ ...formData, cargoDetails: { ...formData.cargoDetails, weight: e.target.value } })} />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input type="number" value={formData.cargoDetails.quantity} onChange={(e) => setFormData({ ...formData, cargoDetails: { ...formData.cargoDetails, quantity: e.target.value } })} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={formData.cargoDetails.description} onChange={(e) => setFormData({ ...formData, cargoDetails: { ...formData.cargoDetails, description: e.target.value } })} />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={formData.status} onChange={handleStatusChange}>
            <option value="Booked">Booked</option>
            <option value="Checked In">Checked In</option>
            <option value="In Transit">In Transit</option>
            <option value="Arrived">Arrived</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>

        <div className="form-group">
          <label>Departure Date</label>
          <input type="datetime-local" name="departureDate" value={formData.departureDate} onChange={handleChange} />
        </div>

        {formData.status === "Arrived" && (
          <div className="form-group">
            <label>Arrival Date</label>
            <input type="datetime-local" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} />
          </div>
        )}

        {formData.status === "Withdrawn" && (
          <div className="form-group">
            <label>Withdrawn Date</label>
            <input type="datetime-local" name="withdrawnAt" value={formData.withdrawnAt} onChange={handleChange} />
            <button type="button" className="receipt-btn" onClick={handleDownloadReceipt}>Download Receipt</button>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default CargoEdit;

