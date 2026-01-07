import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./PassengerCharters.css";
import jet4 from "../../assets/jet4.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { API_URL } from "../../config/api.js";
import jeta from '../../assets/jeta.png';
import jetb from '../../assets/jetb.png';
import jetc from '../../assets/jetc.png';
import jetd from '../../assets/jetd.png';
import jete from '../../assets/jete.png';
import jetf from '../../assets/jetf.png';
import jetg from '../../assets/jetg.png';
import jeth from '../../assets/jeth.png';
import jeti from '../../assets/jeti.png';
import jetj from '../../assets/jetj.png';
import jetk from '../../assets/jetk.png';
import jetl from '../../assets/jetl.png';
import jetm from '../../assets/jetm.png';
import jetn from '../../assets/jetn.png';
import jeto from '../../assets/jeto.png';
import jetp from '../../assets/jetp.png';
import jetq from '../../assets/jetq.png';
import jetr from '../../assets/jetr.png';
import jets from '../../assets/jets.png';
import jett from '../../assets/jett.png';
import jetu from '../../assets/jetu.png';
import jetv from '../../assets/jetv.png';
import jetw from '../../assets/jetw.png';
import jetx from '../../assets/jetx.png';

/* Fix Leaflet default marker icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Helpers */
function interpolatePosition(points, ratio) {
  if (!points || points.length < 2) return points[0];
  const origin = points[0];
  const destination = points[points.length - 1];
  return {
    lat: origin.lat + (destination.lat - origin.lat) * ratio,
    lng: origin.lng + (destination.lng - origin.lng) * ratio,
  };
}

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
const fleetData = [
  {
    category: "Very Light Jets",
    jets: [
      {
        name: "Cessna Citation Mustang",
        image: jeta,
        description: "Efficient and economical jet for short regional trips and quick business travel."
      },
      {
        name: "Embraer Phenom 100",
        image: jetb,
        description: "Modern very light jet offering comfort, speed, and excellent fuel efficiency."
      },
      {
        name: "HondaJet HA-420",
        image: jetc,
        description: "Innovative design with over-the-wing engines and a quiet, refined cabin."
      }
    ]
  },

  {
    category: "Light Jets",
    jets: [
      {
        name: "Cessna Citation CJ3",
        image: jetd,
        description: "Reliable light jet with impressive range and performance for regional routes."
      },
      {
        name: "Cessna Citation CJ4",
        image: jete,
        description: "Enhanced speed and cabin comfort with advanced avionics."
      },
      {
        name: "Embraer Phenom 300",
        image: jetf,
        description: "One of the most popular light jets, balancing speed, range, and luxury."
      },
      {
        name: "Beechcraft Premier 1A",
        image: jetg,
        description: "High-speed light jet ideal for executives requiring efficient point-to-point travel."
      }
    ]
  },

  {
    category: "Midsize Jets",
    jets: [
      {
        name: "Hawker 800XP",
        image: jeth,
        description: "Spacious midsize jet with excellent runway performance and reliability."
      },
      {
        name: "Cessna Citation XLS+",
        image: jeti,
        description: "Stand-up cabin comfort with strong performance and flexible routing."
      },
      {
        name: "Learjet 60",
        image: jetj,
        description: "Fast and powerful midsize jet designed for business-critical missions."
      }
    ]
  },

  {
    category: "Super Midsize Jets",
    jets: [
      {
        name: "Bombardier Challenger 350",
        image: jetk,
        description: "Industry-leading super midsize jet offering range, comfort, and reliability."
      },
      {
        name: "Gulfstream G280",
        image: jetl,
        description: "High-speed super midsize jet with long-range capability and advanced avionics."
      },
      {
        name: "Cessna Citation Longitude",
        image: jetm,
        description: "Large-cabin comfort combined with impressive efficiency and transcontinental range."
      }
    ]
  },

  {
    category: "Heavy Jets",
    jets: [
      {
        name: "Bombardier Challenger 650",
        image: jetn,
        description: "Long-range heavy jet offering exceptional comfort and cabin flexibility."
      },
      {
        name: "Dassault Falcon 900",
        image: jeto,
        description: "Tri-jet design providing outstanding range, safety, and airport accessibility."
      },
      {
        name: "Gulfstream G450",
        image: jetp,
        description: "Reliable heavy jet with long-range performance and luxurious interior."
      }
    ]
  },

  {
    category: "Ultra-Long-Range Jets",
    jets: [
      {
        name: "Gulfstream G650ER",
        image: jetq,
        description: "Ultra-long-range jet capable of connecting global city pairs nonstop."
      },
      {
        name: "Gulfstream G700",
        image: jetr,
        description: "Next-generation flagship jet offering unmatched comfort and cabin technology."
      },
      {
        name: "Bombardier Global 7500",
        image: jets,
        description: "Industry-leading range and luxury for nonstop intercontinental travel."
      },
      {
        name: "Bombardier Global 8000",
        image: jett,
        description: "Fastest business jet designed for ultra-long-haul missions."
      },
      {
        name: "Dassault Falcon 10X",
        image: jetu,
        description: "Advanced ultra-long-range jet with the widest cabin in its class."
      }
    ]
  },

  {
    category: "VIP Airliners",
    jets: [
      {
        name: "Boeing Business Jet (BBJ)",
        image: jetv,
        description: "Ultimate VIP aircraft offering unmatched space, range, and customization."
      },
      {
        name: "Airbus ACJ320",
        image: jetw,
        description: "Corporate airliner with luxurious cabin layouts for heads of state and executives."
      },
      {
        name: "Airbus ACJ350",
        image: jetx,
        description: "Ultra-long-range VIP airliner with exceptional comfort and global reach."
      }
    ]
  }
];


const PassengerCharters = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    try {
      let query = trackingNumber.trim();
      if (!query.startsWith("PASS_")) query = `PASS_${query}`;

      const res = await fetch(`${API_URL}/passengers/track/${query}`);

      if (!res.ok) {
        alert("Passenger not found");
        return;
      }

      const { data } = await res.json();

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
          <p>
            Experience private aviation redefined — seamless travel, absolute
            comfort, and total control of your journey.
            You can track your flight right here below.
          </p>
        </div>
      </section>

      {/* Tracking */}
      <section className="pc-tracking">
        <h2>Track Your Flight</h2>
        <p className="pc-tracking-intro">
          Stay informed every step of the way. Enter your booking reference to
          view real-time flight status, route progress, and booking details.
        </p>

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
                  attribution='&copy; OpenStreetMap contributors'
                />

                <Polyline
                  positions={routeData.points.map((p) => [p.lat, p.lng])}
                  color="blue"
                  weight={3}
                  dashArray="5"
                />

                <Marker
                  position={[
                    routeData.origin.coordinates.lat,
                    routeData.origin.coordinates.lng,
                  ]}
                >
                  <Popup>Origin: {routeData.origin.city}</Popup>
                </Marker>

                <Marker
                  position={[
                    routeData.destination.coordinates.lat,
                    routeData.destination.coordinates.lng,
                  ]}
                >
                  <Popup>Destination: {routeData.destination.city}</Popup>
                </Marker>

                {routeData.checkpoints?.map((c, i) => (
                  <Marker
                    key={i}
                    position={[c.coordinates.lat, c.coordinates.lng]}
                  >
                    <Popup>
                      {c.city}
                      <br />
                      Updated: {new Date(c.updatedAt).toLocaleString()}
                    </Popup>
                  </Marker>
                ))}

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
                        Status: {routeData.status}
                        <br />
                        Location:{" "}
                        {routeData.currentLocation?.city || "En route"}
                      </Popup>
                    </Marker>
                  );
                })()}
              </MapContainer>
            </div>

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

      {/* About */}
      <section className="pc-about">
        <h2>About Our Passenger Charters</h2>
        <p>
          Our passenger charter services are designed for travelers who value
          time, privacy, and personalized service. Whether you are flying for
          business, leisure, government missions, or special events, we tailor
          every flight to your exact needs.
        </p>
        <p>
          From flexible departure schedules to premium onboard amenities, we
          ensure that every journey is smooth, secure, and memorable — from
          takeoff to touchdown.
        </p>
      </section>

      {/* Features */}
      <section className="pc-features">
        <div className="feature">
          <h3>Luxury Experience</h3>
          <p>
            Enjoy spacious seating, premium interiors, onboard catering, and a
            quiet, private environment designed for your comfort.
          </p>
        </div>

        <div className="feature">
          <h3>Flexible Scheduling</h3>
          <p>
            Fly on your terms. Choose departure times and routes that suit your
            plans, without the limitations of commercial airline schedules.
          </p>
        </div>

        <div className="feature">
          <h3>Regional & Global Reach</h3>
          <p>
            We operate across East Africa and beyond, connecting you to key
            cities, remote destinations, and international hubs with ease.
          </p>
        </div>

        <div className="feature">
          <h3>Safety & Reliability</h3>
          <p>
            Your safety comes first. Our aircraft are fully certified and
            operated by experienced, highly trained flight crews.
          </p>
        </div>
      </section>
      {/* Fleet */}
      <section className="pc-fleet">
        <h2>Our Aircraft Fleet</h2>
        <p className="pc-fleet-intro">
          Choose from a diverse range of modern aircraft — from efficient light jets
          to ultra-luxurious VIP airliners — all maintained to the highest standards.
        </p>

        {fleetData.map((group, idx) => (
          <div key={idx} className="fleet-category">
            <h3>{group.category}</h3>

            <div className="fleet-grid">
              {group.jets.map((jet, i) => (
                <div key={i} className="fleet-card">
                  <div className="fleet-image">
                    <img src={jet.image} alt={jet.name} />
                  </div>
                  <div className="fleet-info">
                    <h4>{jet.name}</h4>
                    <p>{jet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>



      {/* Testimonials */}
      <section className="pc-testimonials">
        <h2>Trusted by Our Clients</h2>

        <div className="testimonial">
          <p>
            “From booking to arrival, everything was handled professionally. The
            comfort and privacy exceeded our expectations.”
          </p>
          <span>— John M., Corporate Client</span>
        </div>

        <div className="testimonial">
          <p>
            “Reliable, flexible, and extremely responsive. This is now our
            preferred way to travel for executive trips.”
          </p>
          <span>— Sarah K., Business Executive</span>
        </div>
      </section>

      {/* Contact */}
      <section className="pc-contact">
        <h2>Ready to Take Off?</h2>
        <p>
          Let us handle your next journey with precision and care. Speak to our
          team today and experience the freedom of private air travel.
        </p>

        <div className="pc-buttons">
          <a href="https://wa.me/254113410633" target="_blank" rel="noreferrer">
            Chat on WhatsApp
          </a>
          <a href="mailto:info@yourdomain.com">Email Our Team</a>
        </div>
      </section>
    </div>
  );
};

export default PassengerCharters;

