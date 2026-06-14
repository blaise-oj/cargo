import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city";
import "./CargoEdit.css";
import { API_URL } from "../../../config/api.js";

const emptyCargoDetails = {
  length: "",
  width: "",
  height: "",
  weight: "",
  quantity: "",
  pieces: "",
  natureOfGoods: "",
  commodityItemNumber: "",
  description: "",
  volume: 0,
};
const CargoEdit = () => {
  const { airwaybill } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [currentCities, setCurrentCities] = useState([]);

  // Fetch cargo data
  useEffect(() => {
    const fetchCargo = async () => {
      try {
        const res = await fetch(`${API_URL}/cargo/track/${airwaybill}`);
        const data = await res.json();
        if (!data.success || !data.cargo) throw new Error("No cargo data found");
        const cargo = data.cargo;
        console.log("EDIT CARGO DATA:", cargo);

        setFormData({
          customerName: cargo.customerName || "",
          customerEmail: cargo.customerEmail || "",

          shipperName: cargo.shipper?.name || "",
          shipperAddress: cargo.shipper?.address || "",
          shipperAccountNumber: cargo.shipper?.accountNumber || "",

          consigneeName: cargo.consignee?.name || "",
          consigneeAddress: cargo.consignee?.address || "",
          consigneeAccountNumber: cargo.consignee?.accountNumber || "",

          flightNumber: cargo.flightDetails?.flightNumber || "",
          airline: cargo.flightDetails?.airline || "",
          departureAirport: cargo.flightDetails?.departureAirport || "",
          destinationAirport: cargo.flightDetails?.destinationAirport || "",
          departureTime: cargo.flightDetails?.departureTime
            ? new Date(cargo.flightDetails.departureTime).toISOString().slice(0, 16)
            : "",

          originCountry: cargo.origin?.country || "",
          originCity: cargo.origin?.city || "",
          destinationCountry: cargo.destination?.country || "",
          destinationCity: cargo.destination?.city || "",
          currentCountry: cargo.currentLocation?.country || cargo.origin?.country || "",
          currentCity: cargo.currentLocation?.city || cargo.origin?.city || "",

          cargoDetails: {
            ...emptyCargoDetails,
            length: cargo.cargoDetails?.length?.toString() || "",
            width: cargo.cargoDetails?.width?.toString() || "",
            height: cargo.cargoDetails?.height?.toString() || "",
            weight: cargo.cargoDetails?.weight?.toString() || "",
            quantity: cargo.cargoDetails?.quantity?.toString() || "",
            pieces: cargo.cargoDetails?.pieces?.toString() || "",
            natureOfGoods: cargo.cargoDetails?.natureOfGoods || "",
            commodityItemNumber: cargo.cargoDetails?.commodityItemNumber || "",
            description: cargo.cargoDetails?.description || "",
            volume: cargo.cargoDetails?.volume || 0,
          },

          price: cargo.price?.toString() || "",

          currency: cargo.awbDetails?.currency || "USD",
          declaredValueCarriage: cargo.awbDetails?.declaredValueCarriage || "NVD",
          declaredValueCustoms: cargo.awbDetails?.declaredValueCustoms || "NCV",
          insuranceAmount: cargo.awbDetails?.insuranceAmount || "",
          handlingInformation: cargo.awbDetails?.handlingInformation || "",
          accountingInformation: cargo.awbDetails?.accountingInformation || "",

          rateClass: cargo.charges?.rateClass || "",
          chargeableWeight: cargo.charges?.chargeableWeight?.toString() || "",
          rate: cargo.charges?.rate?.toString() || "",
          weightCharge: cargo.charges?.weightCharge?.toString() || "",
          valuationCharge: cargo.charges?.valuationCharge?.toString() || "",
          tax: cargo.charges?.tax?.toString() || "",
          totalOtherChargesDueAgent:
            cargo.charges?.totalOtherChargesDueAgent?.toString() || "",
          totalOtherChargesDueCarrier:
            cargo.charges?.totalOtherChargesDueCarrier?.toString() || "",
          totalPrepaid: cargo.charges?.totalPrepaid?.toString() || "",
          totalCollect: cargo.charges?.totalCollect?.toString() || "",

          delayedAt: cargo.delayedAt
            ? new Date(cargo.delayedAt).toISOString().slice(0, 16)
            : "",
          delayReason: cargo.delayReason || "",
          withdrawReason: cargo.withdrawReason || "",
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

  // Auto-calculate volume
  useEffect(() => {
    if (!formData?.cargoDetails) return;

    const length = parseFloat(formData.cargoDetails.length) || 0;
    const width = parseFloat(formData.cargoDetails.width) || 0;
    const height = parseFloat(formData.cargoDetails.height) || 0;

    const volume = length * width * height;

    setFormData((prev) => ({
      ...prev,
      cargoDetails: { ...prev.cargoDetails, volume },
    }));
  }, [
    formData?.cargoDetails?.length,
    formData?.cargoDetails?.width,
    formData?.cargoDetails?.height,
  ]);

  if (loading) return <p className="loading">Loading cargo data...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!formData) return <p className="error">No cargo data to edit</p>;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCargoDetailChange = (field, value) => {
    setFormData({
      ...formData,
      cargoDetails: { ...formData.cargoDetails, [field]: value },
    });
  };

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

  const statusOrder = [
    "Booked",
    "Checked In",
    "Delayed",
    "In Transit",
    "Arrived",
    "Withdrawn",
  ];


  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    const currentIndex = statusOrder.indexOf(formData.status);
    const nextIndex = statusOrder.indexOf(newStatus);

    if (nextIndex < currentIndex) {
      alert("⚠️ You cannot move cargo backward in status.");
      return;
    }

    let updated = { ...formData, status: newStatus };

    if (newStatus === "Delayed" && !formData.delayedAt) {
      updated.delayedAt = new Date().toISOString().slice(0, 16);
    }

    if (newStatus === "In Transit" && !formData.departureDate) {
      updated.departureDate = new Date().toISOString().slice(0, 16);
    }

    if (newStatus === "Arrived" && !formData.arrivalDate) {
      updated.arrivalDate = new Date().toISOString().slice(0, 16);
    }

    if (newStatus === "Withdrawn" && !formData.withdrawnAt) {
      updated.withdrawnAt = new Date().toISOString().slice(0, 16);
    }

    if (formData.status === "Withdrawn" && newStatus !== "Withdrawn") {
      updated.withdrawnAt = "";
      updated.withdrawReason = "";
    }

    if (formData.status === "Delayed" && newStatus !== "Delayed") {
      updated.delayedAt = "";
      updated.delayReason = "";
    }

    if (["Booked", "Checked In", "Delayed"].includes(newStatus)) {
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
    if (actionLoading) return;
    setActionLoading(true);

    const originData = originCities.find((c) => c.name === formData.originCity);
    const destinationData = destinationCities.find((c) => c.name === formData.destinationCity);
    const currentData = currentCities.find((c) => c.name === formData.currentCity);

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      origin: {
        country: formData.originCountry,
        city: formData.originCity,
        lat: originData?.latitude || 0,
        lng: originData?.longitude || 0,
      },
      destination: {
        country: formData.destinationCountry,
        city: formData.destinationCity,
        lat: destinationData?.latitude || 0,
        lng: destinationData?.longitude || 0,
      },
      currentLocation: {
        country: formData.currentCountry,
        city: formData.currentCity,
        lat: currentData?.latitude || 0,
        lng: currentData?.longitude || 0,
      },
      cargoDetails: {
        length: parseFloat(formData.cargoDetails.length) || 0,
        width: parseFloat(formData.cargoDetails.width) || 0,
        height: parseFloat(formData.cargoDetails.height) || 0,
        weight: parseFloat(formData.cargoDetails.weight) || 0,
        quantity: parseInt(formData.cargoDetails.quantity) || 0,
        pieces:
          parseInt(formData.cargoDetails.pieces) ||
          parseInt(formData.cargoDetails.quantity) ||
          0,
        natureOfGoods: formData.cargoDetails.natureOfGoods,
        commodityItemNumber: formData.cargoDetails.commodityItemNumber,
        description: formData.cargoDetails.description,
        volume: parseFloat(formData.cargoDetails.volume) || 0,
      },
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
        flightNumber: formData.flightNumber,
        departureAirport: formData.departureAirport,
        destinationAirport: formData.destinationAirport,
        departureTime: formData.departureTime,
        airline: formData.airline,
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
      price: parseFloat(formData.price) || 0,
      departureDate: formData.departureDate || null,
      arrivalDate: formData.arrivalDate || null,
      withdrawnAt: formData.withdrawnAt || null,
      withdrawReason: formData.withdrawReason || "",
      status: formData.status,
      delayedAt: formData.status === "Delayed" ? formData.delayedAt || new Date().toISOString() : null,
      delayReason: formData.status === "Delayed" ? formData.delayReason || "" : "",
    };

    try {
      const res = await fetch(`${API_URL}/cargo/track/${airwaybill}`, {
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
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this cargo?")) return;
    if (actionLoading) return;
    setActionLoading(true);

    try {
      const res = await fetch(`${API_URL}/cargo/${airwaybill}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("Cargo deleted!");
      navigate("/cargocharters");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    window.open(`${API_URL}/cargo/${airwaybill}/receipt`, "_blank");
  };

  const renderCityOptions = (citiesList) =>
    citiesList.map((c) => (
      <option key={`${c.name}-${c.latitude}-${c.longitude}`} value={c.name}>
        {c.name}
      </option>
    ));

  return (
    <div className="cargo-edit-container">
      <h2>Edit Cargo Airwaybill <span>{airwaybill}</span></h2>
      <form onSubmit={handleSubmit} className="cargo-form">
        {/* Customer Info */}
        <div className="form-group">
          <label>Customer Name</label>
          <input name="customerName" value={formData.customerName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Customer Email</label>
          <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Shipper Name</label>
          <input
            name="shipperName"
            value={formData.shipperName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Shipper Address</label>
          <textarea
            name="shipperAddress"
            value={formData.shipperAddress}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Shipper Account Number</label>
          <input
            name="shipperAccountNumber"
            value={formData.shipperAccountNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Consignee Name</label>
          <input
            name="consigneeName"
            value={formData.consigneeName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Consignee Address</label>
          <textarea
            name="consigneeAddress"
            value={formData.consigneeAddress}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Consignee Account Number</label>
          <input
            name="consigneeAccountNumber"
            value={formData.consigneeAccountNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Flight Number</label>
          <input
            name="flightNumber"
            value={formData.flightNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Airline</label>
          <input
            name="airline"
            value={formData.airline}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Departure Airport</label>
          <input
            name="departureAirport"
            value={formData.departureAirport}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Destination Airport</label>
          <input
            name="destinationAirport"
            value={formData.destinationAirport}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Flight Departure Time</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
          />
        </div>

        {/* Locations */}
        <div className="form-group">
          <label>Origin Country</label>
          <select value={formData.originCountry} onChange={(e) => handleCountryChange("origin", e.target.value)}>
            <option value="">Select Country</option>
            {Country.getAllCountries().map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Origin City</label>
          <select
            value={formData.originCity}
            onChange={(e) =>
              setFormData({
                ...formData,
                originCity: e.target.value,
              })
            }
            disabled={!formData.originCountry}
          >
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
          <select
            value={formData.destinationCity}
            onChange={(e) =>
              setFormData({
                ...formData,
                destinationCity: e.target.value,
              })
            }
            disabled={!formData.destinationCountry}
          >
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
          <select
            value={formData.currentCity}
            onChange={(e) =>
              setFormData({
                ...formData,
                currentCity: e.target.value,
              })
            }
            disabled={!formData.currentCountry}
          >
            <option value="">Select City</option>
            {renderCityOptions(currentCities)}
          </select>
        </div>

        {/* Cargo Details */}
        <div className="form-group">
          <label>Length (cm)</label>
          <input
            type="number"
            value={formData.cargoDetails.length}
            onChange={(e) => handleCargoDetailChange("length", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Width (cm)</label>
          <input
            type="number"
            value={formData.cargoDetails.width}
            onChange={(e) => handleCargoDetailChange("width", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Height (cm)</label>
          <input
            type="number"
            value={formData.cargoDetails.height}
            onChange={(e) => handleCargoDetailChange("height", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Volume (cm³)</label>
          <input type="number" value={formData.cargoDetails.volume} readOnly />
        </div>

        <div className="form-group">
          <label>Weight (kg)</label>
          <input
            type="number"
            value={formData.cargoDetails.weight}
            onChange={(e) => handleCargoDetailChange("weight", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={formData.cargoDetails.quantity}
            onChange={(e) => handleCargoDetailChange("quantity", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.cargoDetails.description}
            onChange={(e) => handleCargoDetailChange("description", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Pieces</label>
          <input
            type="number"
            value={formData.cargoDetails.pieces || ""}
            onChange={(e) => handleCargoDetailChange("pieces", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Nature of Goods</label>
          <input
            value={formData.cargoDetails.natureOfGoods || ""}
            onChange={(e) => handleCargoDetailChange("natureOfGoods", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Commodity Item Number</label>
          <input
            value={formData.cargoDetails.commodityItemNumber || ""}
            onChange={(e) => handleCargoDetailChange("commodityItemNumber", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
        </div>
        <h3>Charges / AWB Information</h3>

        <div className="form-group">
          <label>Currency</label>
          <input name="currency" value={formData.currency || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Rate Class</label>
          <input name="rateClass" value={formData.rateClass || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Chargeable Weight</label>
          <input type="number" name="chargeableWeight" value={formData.chargeableWeight || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Rate</label>
          <input type="number" name="rate" value={formData.rate || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Weight Charge</label>
          <input type="number" name="weightCharge" value={formData.weightCharge || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Valuation Charge</label>
          <input type="number" name="valuationCharge" value={formData.valuationCharge || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Tax</label>
          <input type="number" name="tax" value={formData.tax || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Total Other Charges Due Agent</label>
          <input type="number" name="totalOtherChargesDueAgent" value={formData.totalOtherChargesDueAgent || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Total Other Charges Due Carrier</label>
          <input type="number" name="totalOtherChargesDueCarrier" value={formData.totalOtherChargesDueCarrier || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Total Prepaid</label>
          <input type="number" name="totalPrepaid" value={formData.totalPrepaid || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Total Collect</label>
          <input type="number" name="totalCollect" value={formData.totalCollect || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Declared Value for Carriage</label>
          <input name="declaredValueCarriage" value={formData.declaredValueCarriage || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Declared Value for Customs</label>
          <input name="declaredValueCustoms" value={formData.declaredValueCustoms || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Insurance Amount</label>
          <input name="insuranceAmount" value={formData.insuranceAmount || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Handling Information</label>
          <textarea name="handlingInformation" value={formData.handlingInformation || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Accounting Information</label>
          <textarea name="accountingInformation" value={formData.accountingInformation || ""} onChange={handleChange} />
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>
          <select value={formData.status} onChange={handleStatusChange}>
            <option value="Booked">Booked</option>
            <option value="Checked In">Checked In</option>
            <option value="Delayed">Delayed</option>
            <option value="In Transit">In Transit</option>
            <option value="Arrived">Arrived</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>

        <div className="form-group">
          <label>Departure Date</label>
          <input type="datetime-local" name="departureDate" value={formData.departureDate} onChange={handleChange} />
        </div>

        {formData.status === "Delayed" && (
          <>
            <div className="form-group">
              <label>Delayed Date</label>
              <input
                type="datetime-local"
                name="delayedAt"
                value={formData.delayedAt || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Delay Reason</label>
              <textarea
                name="delayReason"
                value={formData.delayReason || ""}
                onChange={handleChange}
                placeholder="Reason for delay (weather, documentation, technical issue)"
              />
            </div>
          </>
        )}


        {formData.status === "Arrived" && (
          <div className="form-group">
            <label>Arrival Date</label>
            <input type="datetime-local" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} />
          </div>
        )}

        {formData.status === "Withdrawn" && (
          <>
            <div className="form-group">
              <label>Withdrawn Date</label>
              <input
                type="datetime-local"
                name="withdrawnAt"
                value={formData.withdrawnAt || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Withdraw Reason (Optional)</label>
              <textarea name="withdrawReason" value={formData.withdrawReason} onChange={handleChange} placeholder="Enter withdrawal reason (optional)" />
            </div>

            <button type="button" className="receipt-btn" onClick={handleDownloadReceipt}>Download Receipt</button>
          </>
        )}

        <div className="form-actions">
          <button type="button" className="cargo-back-btn" onClick={() => navigate(-1)} disabled={actionLoading}>Back</button>
          <button type="submit" className="cargo-save-btn" disabled={actionLoading}>{actionLoading ? "Saved" : "Save Changes"}</button>
          <button type="button" className="cargo-delete-btn" onClick={handleDelete} >Delete</button>
        </div>

      </form>
    </div>
  );
};

export default CargoEdit;
