import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./CargoCharters.css";
import jet6 from "../../assets/jet6.png";
import { API_URL } from "../../config/api.js";
import cj1 from "../../assets/cj1.png";
import cj2 from "../../assets/cj2.png";
import cj3 from "../../assets/cj3.png";
import cj4 from "../../assets/cj4.png";
import cj5 from "../../assets/cj5.png";
import cj6 from "../../assets/cj6.png";
import cj7 from "../../assets/cj7.png";
import cj8 from "../../assets/cj8.png";
import cj9 from "../../assets/cj9.png";
import cj10 from "../../assets/cj10.png";
import cj11 from "../../assets/cj11.png";
import cj12 from "../../assets/cj12.png";
import cj13 from "../../assets/cj13.png";
import cj14 from "../../assets/cj14.png";
import cj15 from "../../assets/cj15.png";
import cj16 from "../../assets/cj16.png";
import cj17 from "../../assets/cj17.png";
import cj18 from "../../assets/cj18.png";
import cj19 from "../../assets/cj19.png";
import cj20 from "../../assets/cj20.png";
import cj21 from "../../assets/cj21.png";


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



const cargoFleet = [
  {
    category: "Light Cargo & Utility Aircraft",
    description:
      "Ideal for short runways, remote destinations, and urgent regional cargo.",
    aircraft: [
      {
        name: "Cessna 408 SkyCourier",
        image: "cj1.png",
        info: "Modern turboprop optimized for high-frequency regional cargo routes.",
      },
      {
        name: "Beechcraft 1900D Cargo",
        image: "cj2.png",
        info: "Reliable twin-engine aircraft for regional logistics operations.",
      },
      {
        name: "Dornier 228",
        image: "cj3.png",
        info: "STOL aircraft capable of operating in challenging environments.",
      },
      {
        name: "Viking Twin Otter",
        image: "cj4.png",
        info: "Legendary aircraft for remote and short-runway operations.",
      },
    ],
  },

  {
    category: "Regional Turboprop Freighters",
    description:
      "Balanced capacity and efficiency for domestic and regional cargo routes.",
    aircraft: [
      {
        name: "ATR 42F",
        image: "cj5.png",
        info: "Efficient regional freighter optimized for scheduled cargo services.",
      },
      {
        name: "ATR 72F",
        image: "cj6.png",
        info: "Higher payload turboprop for increased regional demand.",
      },
      {
        name: "Dash 8-300F",
        image: "cj7.png",
        info: "Proven regional freighter with excellent runway performance.",
      },
      {
        name: "Dash 8-400F",
        image: "cj8.png",
        info: "High-speed turboprop offering jet-like performance.",
      },
      {
        name: "Fokker 50F",
        image: "cj9.png",
        info: "Durable turboprop designed for high-cycle cargo operations.",
      },
    ],
  },

  {
    category: "Narrow-Body Jet Freighters",
    description:
      "Jet-powered cargo aircraft for medium-haul regional and continental routes.",
    aircraft: [
      {
        name: "Boeing 737-300F / 400F",
        image: "cj10.png",
        info: "Reliable jet freighters with proven cargo performance.",
      },
      {
        name: "Boeing 737-800BCF / BDSF",
        image: "cj11.png",
        info: "Next-generation converted freighter with improved efficiency.",
      },
      {
        name: "McDonnell Douglas DC-9F",
        image: "cj12.png",
        info: "Rugged jet freighter ideal for short and medium-haul operations.",
      },
    ],
  },

  {
    category: "Wide-Body & Heavy Freighters",
    description:
      "Long-haul, high-capacity aircraft for international and oversized cargo.",
    aircraft: [
      {
        name: "Airbus A330-200F",
        image: "cj13.png",
        info: "Purpose-built wide-body freighter balancing payload and range.",
      },
      {
        name: "Boeing 777F",
        image: "cj14.png",
        info: "Ultra-efficient long-haul freighter with exceptional payload.",
      },
      {
        name: "Boeing 747-8F",
        image: "cj15.png",
        info: "Iconic heavy freighter with unmatched volume and payload.",
      },
      {
        name: "Antonov An-124",
        image: "cj16.png",
        info: "One of the world’s largest cargo aircraft for oversized loads.",
      },
      {
        name: "Ilyushin Il-76",
        image: "cj17.png",
        info: "Heavy-lift aircraft capable of operating from rough runways.",
      },
    ],
  },

  {
    category: "Combi & Special Configuration Aircraft",
    description:
      "Flexible aircraft capable of carrying passengers and cargo together.",
    aircraft: [
      {
        name: "Boeing 737 Combi",
        image: "cj18.png",
        info: "Flexible configuration for mixed passenger and cargo transport.",
      },
      {
        name: "Airbus A320 Combi",
        image: "cj19.png",
        info: "Modern combi aircraft with enhanced comfort and efficiency.",
      },
      {
        name: "Boeing 747 Combi",
        image: "cj20.png",
        info: "High-capacity long-haul aircraft for combined cargo and passengers.",
      },
    ],
  },
];
const imageMap = {
  "cj1.png": cj1,
  "cj2.png": cj2,
  "cj3.png": cj3,
  "cj4.png": cj4,
  "cj5.png": cj5,
  "cj6.png": cj6,
  "cj7.png": cj7,
  "cj8.png": cj8,
  "cj9.png": cj9,
  "cj10.png": cj10,
  "cj11.png": cj11,
  "cj12.png": cj12,
  "cj13.png": cj13,
  "cj14.png": cj14,
  "cj15.png": cj15,
  "cj16.png": cj16,
  "cj17.png": cj17,
  "cj18.png": cj18,
  "cj19.png": cj19,
  "cj20.png": cj20,
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
  // ← Move downloadReceipt inside the component
  const downloadReceipt = async () => {
    if (!cargo) {
      alert("No cargo loaded to download");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cargo/${cargo.airwaybill}/receipt`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to download receipt");
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Airwaybill_${cargo.airwaybill}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download airwaybill");
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
          
          <button
            onClick={downloadReceipt}
            className="download-receipt-btn"
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#2E7D32",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Download Cargo Receipt
          </button>

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
      {/* Fleet */}
      <section className="cc-fleet">
        <h2>Our Cargo Aircraft Fleet</h2>

        {cargoFleet.map((group, index) => (
          <div key={index} className="fleet-group">
            <h3>{group.category}</h3>
            <p className="fleet-description">{group.description}</p>

            <div className="fleet-grid">
              {group.aircraft.map((plane, idx) => (
                <div key={idx} className="fleet-card">
                  <img
                    src={imageMap[plane.image]}
                    alt={plane.name}
                  />
                  <h4>{plane.name}</h4>
                  <p>{plane.info}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
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
          <a href="mailto:info@airrushcharters.com">Contact Airrush Team</a>
        </div>
      </section>
    </div>
  );
};

export default CargoCharters;
