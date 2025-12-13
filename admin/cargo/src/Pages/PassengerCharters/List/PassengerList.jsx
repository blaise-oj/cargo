import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PassengerList.css";
import { API_URL } from "../../../config/api.js";

const PassengerList = () => {
  const [passengerBills, setPassengerBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPassengerBills = async () => {
      try {
        const res = await fetch(`${API_URL}/passengers`);
        if (!res.ok) throw new Error("Failed to fetch passenger airwaybills");
        const data = await res.json();
        const bills = data.data || data;
        setPassengerBills(bills);
        setFilteredBills(bills);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPassengerBills();
  }, []);

  // ✅ Format date/time for display
  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // ✅ Format city + country
  const formatLocation = (loc) => {
    if (!loc) return "-";
    if (loc.displayName) return loc.displayName;
    if (loc.city && loc.country) return `${loc.city}, ${loc.country}`;
    if (loc.city) return loc.city;
    return "-";
  };

  // ✅ Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = passengerBills.filter((bill) => {
      const origin = formatLocation(bill.origin).toLowerCase();
      const destination = formatLocation(bill.destination).toLowerCase();

      return (
        bill.airwaybill?.toLowerCase().includes(term) ||
        bill.customerName?.toLowerCase().includes(term) ||
        bill.customerEmail?.toLowerCase().includes(term) ||
        bill.phone?.toLowerCase().includes(term) ||
        origin.includes(term) ||
        destination.includes(term)
      );
    });

    setFilteredBills(filtered);
  };

  if (loading) return <p>Loading passenger airwaybills...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="passenger-list">
      <h2>Passenger Airwaybills</h2>

      <div className="top-bar">
        <Link to="/passengercharters/create" className="create-link">
          + Create New Passenger Airwaybill
        </Link>

        <div className="search-container">
          <span className="search-icon"></span>
          <input
            type="text"
            placeholder="Search by name, city, email, etc..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>


      {filteredBills.length === 0 ? (
        <p>No matching passenger airwaybills found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Airwaybill</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Class</th>
                <th>Status</th>
                <th>Origin (City, Country)</th>
                <th>Destination (City, Country)</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Price</th>
                <th>No. of Passengers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.airwaybill}>
                  <td data-label="Airwaybill">{bill.airwaybill}</td>
                  <td data-label="Customer">{bill.customerName}</td>
                  <td data-label="Email">{bill.customerEmail}</td>
                  <td data-label="Phone">{bill.phone || "-"}</td>
                  <td data-label="Class">{bill.ticketClass || "Economy"}</td>
                  <td data-label="Status">{bill.status || "Pending"}</td>
                  <td data-label="Origin">{formatLocation(bill.origin)}</td>
                  <td data-label="Destination">{formatLocation(bill.destination)}</td>
                  <td data-label="Departure">{formatDateTime(bill.departureDate)}</td>
                  <td data-label="Arrival">{formatDateTime(bill.arrivalDate)}</td>
                  <td data-label="Price">${bill.price?.toFixed(2) || "0.00"}</td>
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
