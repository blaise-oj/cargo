import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./CargoCharters.css";
import jet6 from "../../assets/jet6.png";
import { API_URL } from "../../config/api.js";

// Helper: interpolate position along route
const interpolatePosition = (points, ratio) => {
  if (!points || points.length < 2) return points[0];
  const origin = points[0];
  const destination = points[points.length - 1];
  return {
    lat: origin.lat + (destination.lat - origin.lat) * ratio,
    lng: origin.lng + (destination.lng - origin.lng) * ratio,
  };
};

// Helper: calculate bearing from origin → destination
const getBearing = (origin, destination) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);
  const dLon = toRad(destination.lng - origin.lng);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

// Plane position based on status
const getPlanePosition = (cargo) => {
  const points = [cargo.origin, ...(cargo.route || []), cargo.destination];
  switch (cargo.status.toLowerCase()) {
    case "booked":
    case "checked in":
      return cargo.origin;
    case "in transit":
      return interpolatePosition(points, 0.5);
    case "arrived":
      return cargo.destination;
    default:
      return cargo.origin;
  }
};

const CargoCharters = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [cargo, setCargo] = useState(null);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setCargo(null);
    setShowDetails(false);

    try {
      const res = await fetch(`${API_URL}/cargo/track/${trackingNumber}`);
      const data = await res.json();

      if (!data.success) setError(data.message || "Cargo not found");
      else setCargo(data.cargo);
    } catch (err) {
      console.error(err);
      setError("Error fetching cargo data");
    }
  };

  return (
    <div className="cargo-charters">
      {/* Hero */}
      <section className="cc-hero">
        <img src={jet6} alt="Cargo Charters" />
        <div className="cc-hero-text">
          <h1>Cargo Charters</h1>
          <p>
            Fast, secure, and flexible air cargo solutions — regional & worldwide.
          </p>
        </div>
      </section>

      {/* Tracking */}
      <section className="cc-tracking">
        <h2>Track Your Shipment (Air Waybill)</h2>
        <form onSubmit={handleTrack}>
          <input
            type="text"
            placeholder="Enter Cargo AWB / Booking Ref"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
          />
          <button type="submit">Track</button>
        </form>
        <p className="hint">Example: CARGO_B69C96789EC6</p>
        {error && <p className="error">{error}</p>}
      </section>

      {/* Map */}
      {cargo && (
        <section className="cc-map">
          <h3>Shipment Route for {cargo.airwaybill}</h3>
          <MapContainer
            bounds={[
              [cargo.origin.lat, cargo.origin.lng],
              [cargo.destination.lat, cargo.destination.lng],
            ]}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />

            {/* Route Polyline */}
            <Polyline
              positions={[
                [cargo.origin.lat, cargo.origin.lng],
                ...(cargo.route || []).map((p) => [p.lat, p.lng]),
                [cargo.destination.lat, cargo.destination.lng],
              ]}
              pathOptions={{
                color: "#1d3557",
                weight: 3,
                dashArray: "6, 10",
              }}
            />

            {/* Markers */}
            <Marker position={[cargo.origin.lat, cargo.origin.lng]}>
              <Popup>Origin: {cargo.origin.city}</Popup>
            </Marker>
            <Marker position={[cargo.destination.lat, cargo.destination.lng]}>
              <Popup>Destination: {cargo.destination.city}</Popup>
            </Marker>
            {cargo.route?.map((cp, idx) => (
              <Marker key={idx} position={[cp.lat, cp.lng]}>
                <Popup>{cp.city} — {cp.status}</Popup>
              </Marker>
            ))}

            {/* Plane */}
            {(() => {
              const planePos = getPlanePosition(cargo);
              const bearing = getBearing(cargo.origin, cargo.destination);
              let pulseColor = "blue";
              if (cargo.status.toLowerCase() === "in transit") pulseColor = "red";
              if (cargo.status.toLowerCase() === "arrived") pulseColor = "green";

              const planeIcon = L.divIcon({
                html: `
                  <div class="plane-wrapper">
                    <i class="fa fa-plane plane-icon" style="transform: rotate(${bearing}deg); color:#222;"></i>
                    <span class="pulse-wave" style="background:${pulseColor};"></span>
                    <span class="pulse-wave" style="background:${pulseColor};"></span>
                    <span class="pulse-wave" style="background:${pulseColor};"></span>
                  </div>
                `,
                className: "",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              });

              return <Marker position={[planePos.lat, planePos.lng]} icon={planeIcon} />;
            })()}
          </MapContainer>

          {/* Cargo Details */}
          <div className="details-toggle">
            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? "Hide Cargo Details" : "View Cargo Details"}
            </button>
          </div>
          {showDetails && (
            <div className="cargo-details">
              <h4>Cargo Receipt</h4>
              <ul>
                <li><strong>Air Waybill:</strong> {cargo.airwaybill}</li>
                <li><strong>Status:</strong> {cargo.status}</li>
                <li><strong>Origin:</strong> {cargo.origin.city}</li>
                <li><strong>Destination:</strong> {cargo.destination.city}</li>
                <li><strong>Weight:</strong> {cargo.cargoDetails.weight} kg</li>
                <li><strong>Quantity:</strong> {cargo.cargoDetails.quantity}</li>
                <li><strong>Description:</strong> {cargo.cargoDetails.description}</li>
                <li><strong>Updated:</strong> {new Date(cargo.updatedAt).toLocaleString()}</li>
              </ul>
            </div>
          )}
        </section>
      )}

      {/* About */}
      <section className="cc-about">
        <h2>About Our Cargo Charters</h2>
        <p>
          Our cargo charter services provide fast, secure, and flexible air
          freight solutions for businesses, governments, and humanitarian
          missions. From urgent deliveries to oversized cargo, we tailor every
          flight to your logistical needs.
        </p>
        <p>
          With access to regional and international routes, modern aircraft,
          and experienced logistics teams, we ensure your shipment arrives
          safely, on time, and fully tracked from origin to destination.
        </p>
      </section>

      {/* Services */}
      <section className="cc-services">
        <h2>Our Cargo Services</h2>
        <div className="cc-service-grid">
          <div className="cc-service-card">
            <i className="fa fa-box"></i>
            <h3>General Cargo</h3>
            <p>
              Reliable transportation for commercial goods, retail products,
              and industrial supplies.
            </p>
          </div>

          <div className="cc-service-card">
            <i className="fa fa-snowflake"></i>
            <h3>Perishable Goods</h3>
            <p>
              Temperature-controlled logistics for food, flowers, and medical
              supplies.
            </p>
          </div>

          <div className="cc-service-card">
            <i className="fa fa-industry"></i>
            <h3>Heavy & Oversized Cargo</h3>
            <p>
              Specialized aircraft and handling for machinery, vehicles, and
              project cargo.
            </p>
          </div>

          <div className="cc-service-card">
            <i className="fa fa-ambulance"></i>
            <h3>Humanitarian & Emergency</h3>
            <p>
              Rapid-response airlift for relief operations and urgent missions.
            </p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="cc-industries">
        <h2>Industries We Serve</h2>
        <ul>
          <li>✔ E-commerce & Retail</li>
          <li>✔ Manufacturing & Construction</li>
          <li>✔ Oil, Gas & Mining</li>
          <li>✔ Healthcare & Pharmaceuticals</li>
          <li>✔ Government & NGOs</li>
        </ul>
      </section>

      {/* Why Choose Us */}
      <section className="cc-why">
        <h2>Why Choose Our Cargo Charters</h2>
        <div className="cc-why-grid">
          <div>
            <h4>Speed & Reliability</h4>
            <p>Direct flights with no unnecessary stops.</p>
          </div>
          <div>
            <h4>Real-Time Tracking</h4>
            <p>Full visibility of your shipment using Air Waybill tracking.</p>
          </div>
          <div>
            <h4>Flexible Scheduling</h4>
            <p>Fly when you need — day or night.</p>
          </div>
          <div>
            <h4>Secure Handling</h4>
            <p>Strict safety and compliance standards.</p>
          </div>
        </div>
      </section>

      

      {/* Call To Action */}
      <section className="cc-cta">
        <h2>Need a Custom Cargo Solution?</h2>
        <p>
          Speak to our logistics experts today and get a tailored cargo charter
          plan that fits your timeline and budget.
        </p>
        <div className="cc-cta-buttons">
          <a href="https://wa.me/254113410633" target="_blank" rel="noreferrer">
            Request a Quote
          </a>
          <a href="mailto:cargo@yourdomain.com">Contact Cargo Team</a>
        </div>
      </section>
    </div>
  );
};

export default CargoCharters;
