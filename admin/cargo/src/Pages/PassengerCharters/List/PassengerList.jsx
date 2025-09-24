import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PassengerList.css";
import { API_URL } from "../../../config/api.js";

const PassengerList = () => {
  const [passengerBills, setPassengerBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPassengerBills = async () => {
      try {
        const res = await fetch("${API_URL}/passengers");
        if (!res.ok) throw new Error("Failed to fetch passenger airwaybills");
        const data = await res.json();
        setPassengerBills(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPassengerBills();
  }, []);

  if (loading) return <p>Loading passenger airwaybills...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // ✅ helper function to format date + time
  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // ✅ helper to safely display location objects
  const formatLocation = (location) => {
    if (!location) return "-";
    if (typeof location === "string") return location;
    return location.city || location.coordinates?.displayName || "-";
  };

  return (
    <div className="passenger-list">
      <h2>Passenger Airwaybills</h2>

      <Link to="/passengercharters/create" className="create-link">
        + Create New Passenger Airwaybill
      </Link>

      {passengerBills.length === 0 ? (
        <p>No passenger airwaybills found.</p>
      ) : (
        <div
          className="table-container"
          role="region"
          aria-label="Passenger airwaybills table"
        >
          <table>
            <thead>
              <tr>
                <th>Airwaybill</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Class</th>
                <th>Status</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Departure Date/Time</th>
                <th>Arrival Date/Time</th>
                <th>Price</th>
                <th>No. of Passengers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {passengerBills.map((bill) => (
                <tr key={bill.airwaybill}>
                  <td data-label="Airwaybill">{bill.airwaybill}</td>
                  <td data-label="Customer">{bill.customerName}</td>
                  <td data-label="Email">{bill.customerEmail}</td>
                  <td data-label="Phone">{bill.phone || "-"}</td>
                  <td data-label="Class">{bill.ticketClass || "Economy"}</td>
                  <td data-label="Status">{bill.status}</td>
                  <td data-label="Origin">{formatLocation(bill.origin)}</td>
                  <td data-label="Destination">{formatLocation(bill.destination)}</td>
                  <td data-label="Departure">{formatDateTime(bill.departureDate)}</td>
                  <td data-label="Arrival">{formatDateTime(bill.arrivalDate)}</td>
                  <td data-label="Price">
                    ${bill.price?.toFixed(2) || "0.00"}
                  </td>
                  <td data-label="Passengers">
                    {bill.passengerDetails?.numberOfPassengers || 0}
                  </td>
                  <td data-label="Actions">
                    <Link to={`/passengercharters/edit/${bill.airwaybill}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PassengerList;

