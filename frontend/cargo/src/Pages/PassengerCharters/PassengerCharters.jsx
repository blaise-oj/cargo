import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./PassengerCharters.css";
import jet4 from "../../assets/jet4.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Default Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper to interpolate position along route (ratio = 0 → origin, 1 → dest)
function interpolatePosition(points, ratio) {
  if (!points || points.length < 2) return points[0];
  const origin = points[0];
  const destination = points[points.length - 1];
  return {
    lat: origin.lat + (destination.lat - origin.lat) * ratio,
    lng: origin.lng + (destination.lng - origin.lng) * ratio,
  };
}

// Bearing calculation for rotation
function calculateBearing(start, end) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLon = toRad(end.lng - start.lng);
  const lat1 = toRad(start.lat);
  const lat2 = toRad(end.lat);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Plane position by status
function getPlanePosition(routeData) {
  const { origin, destination, status, points } = routeData;
  if (!origin?.coordinates || !destination?.coordinates) return null;

  switch (status.toLowerCase()) {
    case "booked":
    case "checked in":
      return origin.coordinates;
    case "in transit":
      return interpolatePosition(points, 0.5);
    case "arrived":
      return destination.coordinates;
    default:
      return origin.coordinates;
  }
}

const PassengerCharters = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    try {
      let query = trackingNumber.trim();
      if (!query.startsWith("PASS_")) query = `PASS_${query}`;

      const res = await fetch(
        `http://localhost:4000/api/passengers/track/${query}`
      );

      if (!res.ok) {
        alert("Passenger not found");
        return;
      }

      const { data } = await res.json();

      if (!data.origin || !data.destination) {
        alert("Incomplete route data.");
        return;
      }

      const safeCoords = (loc) =>
        loc?.coordinates?.lat != null && loc?.coordinates?.lng != null
          ? loc.coordinates
          : { lat: 0, lng: 0 };

      const points = [
        safeCoords(data.origin),
        ...(data.checkpoints?.map(safeCoords) || []),
        safeCoords(data.destination),
      ];

      setRouteData({
        ...data,
        origin: data.origin,
        destination: data.destination,
        currentLocation: data.currentLocation,
        checkpoints: data.checkpoints || [],
        points,
      });
      setShowReceipt(false);
    } catch (err) {
      console.error(err);
      alert("Error fetching tracking data.");
    }
  };

  return (
    <div className="passenger-charters">
      {/* Hero */}
      <section className="pc-hero">
        <img src={jet4} alt="Passenger Charters" />
        <div className="pc-hero-text">
          <h1>Passenger Charters</h1>
          <p>Luxury, comfort, and flexibility for your travel needs.</p>
        </div>
      </section>

      {/* About */}
      <section className="pc-about">
        <h2>About Our Passenger Charters</h2>
        <p>
          We provide customized passenger charter services for individuals,
          groups, and corporate travel.
        </p>
      </section>

      {/* Features */}
      <section className="pc-features">
        <div className="feature">
          <h3>Luxury Experience</h3>
          <p>VIP lounges, onboard catering, and ultimate privacy.</p>
        </div>
        <div className="feature">
          <h3>Flexible Scheduling</h3>
          <p>Depart at your convenience, not the airline’s.</p>
        </div>
        <div className="feature">
          <h3>Global Reach</h3>
          <p>Flights across East Africa and worldwide destinations.</p>
        </div>
        <div className="feature">
          <h3>Safety & Reliability</h3>
          <p>Certified aircraft and experienced pilots you can trust.</p>
        </div>
      </section>

      {/* Tracking */}
      <section className="pc-tracking">
        <h2>Track Your Flight</h2>
        <form onSubmit={handleTrack}>
          <input
            type="text"
            placeholder="Enter Air Waybill / Booking Ref"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <button type="submit">Track</button>
        </form>

        {routeData && routeData.points.length > 0 && (
          <>
            <div className="pc-map">
              <MapContainer
                bounds={routeData.points.map((p) => [p.lat, p.lng])}
                style={{ height: "400px", width: "100%", marginTop: "20px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Route polyline */}
                <Polyline
                  positions={routeData.points.map((p) => [p.lat, p.lng])}
                  color="blue"
                  weight={3}
                  dashArray="5"
                />

                {/* Origin */}
                <Marker
                  position={[
                    routeData.origin.coordinates.lat,
                    routeData.origin.coordinates.lng,
                  ]}
                >
                  <Popup>Origin: {routeData.origin.city}</Popup>
                </Marker>

                {/* Destination */}
                <Marker
                  position={[
                    routeData.destination.coordinates.lat,
                    routeData.destination.coordinates.lng,
                  ]}
                >
                  <Popup>Destination: {routeData.destination.city}</Popup>
                </Marker>

                {/* Checkpoints */}
                {routeData.checkpoints.map((c, i) => (
                  <Marker
                    key={i}
                    position={[c.coordinates.lat, c.coordinates.lng]}
                  >
                    <Popup>
                      {c.city} <br />
                      Updated: {new Date(c.updatedAt).toLocaleString()}
                    </Popup>
                  </Marker>
                ))}

                {/* Plane marker */}
                {(() => {
                  const planePos = getPlanePosition(routeData);
                  if (!planePos) return null;

                  const bearing = calculateBearing(
                    routeData.origin.coordinates,
                    routeData.destination.coordinates
                  );

                  let pulseColor = "blue";
                  if (routeData.status.toLowerCase() === "in transit")
                    pulseColor = "red";
                  if (routeData.status.toLowerCase() === "arrived")
                    pulseColor = "green";

                  const planeIcon = L.divIcon({
                    html: `
                      <div class="plane-wrapper">
                        <i class="fa fa-plane plane-icon" style="transform: rotate(${bearing}deg);"></i>
                        <span class="pulse-wave" style="background:${pulseColor};"></span>
                        <span class="pulse-wave" style="background:${pulseColor};"></span>
                        <span class="pulse-wave" style="background:${pulseColor};"></span>
                      </div>
                    `,
                    className: "",
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                  });

                  return (
                    <Marker
                      position={[planePos.lat, planePos.lng]}
                      icon={planeIcon}
                    >
                      <Popup>
                        Status: {routeData.status} <br />
                        Location: {routeData.currentLocation?.city || "En route"}
                      </Popup>
                    </Marker>
                  );
                })()}
              </MapContainer>
            </div>

            {/* Receipt toggle */}
            <div className="pc-receipt-toggle">
              <button onClick={() => setShowReceipt(!showReceipt)}>
                {showReceipt ? "Hide Receipt" : "Show Receipt"}
              </button>
            </div>

            {showReceipt && (
              <div className="pc-receipt">
                <h2>Booking Receipt</h2>
                <div className="receipt-details">
                  <p><strong>Airwaybill:</strong> {routeData.airwaybill}</p>
                  <p><strong>Customer:</strong> {routeData.customerName}</p>
                  <p><strong>Email:</strong> {routeData.customerEmail}</p>
                  <p><strong>Phone:</strong> {routeData.phone}</p>
                  <p><strong>From:</strong> {routeData.origin.displayName}</p>
                  <p><strong>To:</strong> {routeData.destination.displayName}</p>
                  <p><strong>Ticket Class:</strong> {routeData.ticketClass}</p>
                  <p><strong>Status:</strong> {routeData.status}</p>
                  <p><strong>Price:</strong> ${routeData.price}</p>
                  <p><strong>Departure:</strong> {new Date(routeData.departureDate).toLocaleString()}</p>
                  <p><strong>Arrival:</strong> {new Date(routeData.arrivalDate).toLocaleString()}</p>
                  <p><strong>Special Requests:</strong> {routeData.specialRequests || "None"}</p>

                  <h3>Passengers</h3>
                  <ul>
                    {routeData.passengerDetails?.passengerList?.map((p, i) => (
                      <li key={i}>
                        {p.name} — Passport: {p.passportNo}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Testimonials */}
      <section className="pc-testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonial">
          <p>"Smooth process from booking to landing. Truly first-class service."</p>
          <span>- John M.</span>
        </div>
        <div className="testimonial">
          <p>"Highly professional team, flexible and reliable. Recommended!"</p>
          <span>- Sarah K.</span>
        </div>
      </section>

      {/* Contact */}
      <section className="pc-contact">
        <h2>Ready to Fly?</h2>
        <p>Contact us today via WhatsApp or Email to plan your journey.</p>
        <div className="pc-buttons">
          <a href="https://wa.me/254113410633" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href="mailto:info@yourdomain.com">Email Us</a>
        </div>
      </section>
    </div>
  );
};

export default PassengerCharters;
