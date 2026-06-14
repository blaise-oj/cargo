import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import countries from "world-countries";
import { City } from "country-state-city";
import "./CargoCreate.css";
import { API_URL } from "../../../config/api.js";

const CargoCreate = () => {
  const navigate = useNavigate();

  const countryOptions = countries.map((c) => ({
    code: c.cca2,
    name: c.name.common,
  }));

  const defaultForm = {
    customerName: "",
    customerEmail: "",
    shipperName: "",
    shipperAddress: "",
    shipperAccountNumber: "",

    consigneeName: "",
    consigneeAddress: "",
    consigneeAccountNumber: "",

    airline: "",
    flightNumber: "",
    departureAirport: "",
    destinationAirport: "",
    departureTime: "",

    pieces: "",
    natureOfGoods: "",
    commodityItemNumber: "",

    rateClass: "",
    chargeableWeight: "",
    rate: "",
    weightCharge: "",
    valuationCharge: "",
    tax: "",
    totalOtherChargesDueAgent: "",
    totalOtherChargesDueCarrier: "",
    totalPrepaid: "",
    totalCollect: "",

    currency: "USD",
    declaredValueCarriage: "NVD",
    declaredValueCustoms: "NCV",
    insuranceAmount: "",
    handlingInformation: "",
    accountingInformation: "",
    originCountry: "",
    originCity: "",
    destinationCountry: "",
    destinationCity: "",
    weight: "",
    quantity: "",
    description: "",
    price: "",
    departureDate: "",
    length: "",
    width: "",
    height: "",
    volume: "",
  };

  const [formData, setFormData] = useState(defaultForm);
  const [cities, setCities] = useState({ origin: [], destination: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-calculate volume
  useEffect(() => {
    const { length, width, height } = formData;
    if (length && width && height) {
      const volCm3 = length * width * height; // volume in cm³
      setFormData((prev) => ({ ...prev, volume: volCm3 }));
    } else {
      setFormData((prev) => ({ ...prev, volume: 0 }));
    }
  }, [formData.length, formData.width, formData.height]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountrySelect = (countryCode, type) => {
    setFormData({
      ...formData,
      [`${type}Country`]: countryCode,
      [`${type}City`]: "",
    });
    const cityList = City.getCitiesOfCountry(countryCode) || [];
    setCities((prev) => ({ ...prev, [type]: cityList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double clicks
    setLoading(true);

    setError("");

    const originCityData = cities.origin.find(
      (c) => c.name === formData.originCity
    );
    const destCityData = cities.destination.find(
      (c) => c.name === formData.destinationCity
    );

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      shipper: {
        name: formData.shipperName,
        address: formData.shipperAddress,
        accountNumber: formData.shipperAccountNumber,
      },

      consignee: {
        name: formData.consigneeName,
        address: formData.consigneeAddress,
        accountNumber: formData.consigneeAccountNumber,
      },

      flightDetails: {
        airline: formData.airline,
        flightNumber: formData.flightNumber,
        departureAirport: formData.departureAirport,
        destinationAirport: formData.destinationAirport,
        departureTime: formData.departureTime,
      },

      awbDetails: {
        currency: formData.currency,
        declaredValueCarriage: formData.declaredValueCarriage,
        declaredValueCustoms: formData.declaredValueCustoms,
        insuranceAmount: formData.insuranceAmount,
        handlingInformation: formData.handlingInformation,
        accountingInformation: formData.accountingInformation,
      },

      charges: {
        rateClass: formData.rateClass,
        chargeableWeight: parseFloat(formData.chargeableWeight) || 0,
        rate: parseFloat(formData.rate) || 0,
        weightCharge: parseFloat(formData.weightCharge) || 0,
        valuationCharge: parseFloat(formData.valuationCharge) || 0,
        tax: parseFloat(formData.tax) || 0,
        totalOtherChargesDueAgent:
          parseFloat(formData.totalOtherChargesDueAgent) || 0,
        totalOtherChargesDueCarrier:
          parseFloat(formData.totalOtherChargesDueCarrier) || 0,
        totalPrepaid: parseFloat(formData.totalPrepaid) || 0,
        totalCollect: parseFloat(formData.totalCollect) || 0,
      },
      origin: {
        country: formData.originCountry,
        city: formData.originCity,
        lat: originCityData ? parseFloat(originCityData.latitude) : 0,
        lng: originCityData ? parseFloat(originCityData.longitude) : 0,
        updatedAt: new Date(),
      },
      destination: {
        country: formData.destinationCountry,
        city: formData.destinationCity,
        lat: destCityData ? parseFloat(destCityData.latitude) : 0,
        lng: destCityData ? parseFloat(destCityData.longitude) : 0,
        updatedAt: new Date(),
      },
      currentLocation: {
        country: formData.originCountry,
        city: formData.originCity,
        lat: originCityData ? parseFloat(originCityData.latitude) : 0,
        lng: originCityData ? parseFloat(originCityData.longitude) : 0,
        updatedAt: new Date(),
      },
      route: [
        {
          country: formData.originCountry,
          city: formData.originCity,
          lat: originCityData ? parseFloat(originCityData.latitude) : 0,
          lng: originCityData ? parseFloat(originCityData.longitude) : 0,
          status: "Booked",
          note: "Cargo created",
          timestamp: new Date(),
        },
      ],
      cargoDetails: {
        weight: parseFloat(formData.weight) || 0,
        quantity: parseInt(formData.quantity) || 0,
        pieces: parseInt(formData.pieces) || parseInt(formData.quantity) || 0,
        description: formData.description,
        natureOfGoods: formData.natureOfGoods,
        commodityItemNumber: formData.commodityItemNumber,
        length: parseFloat(formData.length) || 0,
        width: parseFloat(formData.width) || 0,
        height: parseFloat(formData.height) || 0,
        volume: parseFloat(formData.volume) || 0,
      },

      price: parseFloat(formData.price) || 0,
      departureDate: formData.departureDate
        ? new Date(formData.departureDate).toISOString()
        : null,
    };

    try {
      const res = await fetch(`${API_URL}/cargo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Safely read response (only if JSON exists)
      let data = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create cargo airwaybill");
      }

      // ✅ SUCCESS (even if backend returns no body)
      alert("✅ Cargo airwaybill created successfully");
      navigate("/cargocharters");
      setFormData(defaultForm);
      setCities({ origin: [], destination: [] });

    } catch (err) {
      console.error("Cargo creation error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="cargo-create-container">
      <div className="cargo-create">
        <h2>Create Cargo Airwaybill</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="cargo-form">
          {/* Customer Info */}
          <label>Customer Name</label>
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />

          <label>Customer Email</label>
          <input
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            required
          />
          <h3>Shipper Information</h3>

          <label>Shipper Name</label>
          <input name="shipperName" value={formData.shipperName} onChange={handleChange} />

          <label>Shipper Address</label>
          <textarea name="shipperAddress" value={formData.shipperAddress} onChange={handleChange} />

          <label>Shipper Account Number</label>
          <input name="shipperAccountNumber" value={formData.shipperAccountNumber} onChange={handleChange} />

          <h3>Consignee Information</h3>

          <label>Consignee Name</label>
          <input name="consigneeName" value={formData.consigneeName} onChange={handleChange} />

          <label>Consignee Address</label>
          <textarea name="consigneeAddress" value={formData.consigneeAddress} onChange={handleChange} />

          <label>Consignee Account Number</label>
          <input name="consigneeAccountNumber" value={formData.consigneeAccountNumber} onChange={handleChange} />

          <h3>Flight Information</h3>

          <label>Airline</label>
          <input name="airline" value={formData.airline} onChange={handleChange} />

          <label>Flight Number</label>
          <input name="flightNumber" value={formData.flightNumber} onChange={handleChange} />

          <label>Departure Airport</label>
          <input name="departureAirport" value={formData.departureAirport} onChange={handleChange} />

          <label>Destination Airport</label>
          <input name="destinationAirport" value={formData.destinationAirport} onChange={handleChange} />

          <label>Flight Departure Time</label>
          <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} />
          <label>Pieces</label>
          <input name="pieces" type="number" value={formData.pieces} onChange={handleChange} />

          <label>Nature of Goods</label>
          <input name="natureOfGoods" value={formData.natureOfGoods} onChange={handleChange} />

          <label>Commodity Item Number</label>
          <input name="commodityItemNumber" value={formData.commodityItemNumber} onChange={handleChange} />

          {/* Origin */}
          <label>Origin Country</label>
          <select
            name="originCountry"
            value={formData.originCountry}
            onChange={(e) => handleCountrySelect(e.target.value, "origin")}
            required
          >
            <option value="">Select Country</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>

          <label>Origin City</label>
          <select
            name="originCity"
            value={formData.originCity}
            onChange={handleChange}
            required
            disabled={!cities.origin.length}
          >
            <option value="">Select City</option>
            {cities.origin.map((city) => (
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
            onChange={(e) => handleCountrySelect(e.target.value, "destination")}
            required
          >
            <option value="">Select Country</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>

          <label>Destination City</label>
          <select
            name="destinationCity"
            value={formData.destinationCity}
            onChange={handleChange}
            required
            disabled={!cities.destination.length}
          >
            <option value="">Select City</option>
            {cities.destination.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          {/* Cargo Details */}
          <label>Weight (kg)</label>
          <input
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            required
          />

          <label>Quantity (pcs)</label>
          <input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          {/* Dimensions */}
          <label>Length (cm)</label>
          <input
            name="length"
            type="number"
            value={formData.length}
            onChange={handleChange}
          />

          <label>Width (cm)</label>
          <input
            name="width"
            type="number"
            value={formData.width}
            onChange={handleChange}
          />

          <label>Height (cm)</label>
          <input
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
          />

          <label>Volume (cm³)</label>
          <input
            name="volume"
            type="number"
            value={formData.volume || 0}
            readOnly
            className="volume-display"
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Price</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
          <h3>Charges / AWB Information</h3>

          <label>Currency</label>
          <input name="currency" value={formData.currency} onChange={handleChange} />

          <label>Rate Class</label>
          <input name="rateClass" value={formData.rateClass} onChange={handleChange} />

          <label>Chargeable Weight</label>
          <input name="chargeableWeight" type="number" value={formData.chargeableWeight} onChange={handleChange} />

          <label>Rate</label>
          <input name="rate" type="number" value={formData.rate} onChange={handleChange} />

          <label>Weight Charge</label>
          <input name="weightCharge" type="number" value={formData.weightCharge} onChange={handleChange} />

          <label>Valuation Charge</label>
          <input name="valuationCharge" type="number" value={formData.valuationCharge} onChange={handleChange} />

          <label>Tax</label>
          <input name="tax" type="number" value={formData.tax} onChange={handleChange} />

          <label>Total Other Charges Due Agent</label>
          <input name="totalOtherChargesDueAgent" type="number" value={formData.totalOtherChargesDueAgent} onChange={handleChange} />

          <label>Total Other Charges Due Carrier</label>
          <input name="totalOtherChargesDueCarrier" type="number" value={formData.totalOtherChargesDueCarrier} onChange={handleChange} />

          <label>Total Prepaid</label>
          <input name="totalPrepaid" type="number" value={formData.totalPrepaid} onChange={handleChange} />

          <label>Total Collect</label>
          <input name="totalCollect" type="number" value={formData.totalCollect} onChange={handleChange} />

          <label>Declared Value for Carriage</label>
          <input name="declaredValueCarriage" value={formData.declaredValueCarriage} onChange={handleChange} />

          <label>Declared Value for Customs</label>
          <input name="declaredValueCustoms" value={formData.declaredValueCustoms} onChange={handleChange} />

          <label>Insurance Amount</label>
          <input name="insuranceAmount" value={formData.insuranceAmount} onChange={handleChange} />

          <label>Handling Information</label>
          <textarea name="handlingInformation" value={formData.handlingInformation} onChange={handleChange} />

          <label>Accounting Information</label>
          <textarea name="accountingInformation" value={formData.accountingInformation} onChange={handleChange} />

          <label>Departure Date & Time</label>
          <input
            name="departureDate"
            type="datetime-local"
            value={formData.departureDate}
            onChange={handleChange}
          />

          <div className="form-buttons">
            <button type="submit" className="cargo-create-btn" disabled={loading} >
              {loading ? "Success" : "Create"}

            </button>
            <button
              type="button"
              className="cargo-create-back-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargoCreate;
