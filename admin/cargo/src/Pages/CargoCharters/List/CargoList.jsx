import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CargoList.css";
import { API_URL } from "../../../config/api.js";

const CargoList = () => {
  const [cargoBills, setCargoBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Format date to East African Time (24h)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return (
      new Date(dateString).toLocaleString("en-GB", {
        timeZone: "Africa/Nairobi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " hrs"
    );
  };

  // Fetch cargo bills
  const fetchCargoBills = async () => {
    try {
      const res = await fetch(`${API_URL}/cargo`);
      if (!res.ok) throw new Error("Failed to fetch cargo airwaybills");
      const data = await res.json();

      // Sort newest first
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.departureDate || 0);
        const dateB = new Date(b.createdAt || b.departureDate || 0);
        return dateB - dateA;
      });

      setCargoBills(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCargoBills();
  }, []);

  // Download receipt
  const downloadReceipt = async (airwaybill) => {
    try {
      const res = await fetch(`${API_URL}/cargo/${airwaybill}/receipt`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Failed to download receipt");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt_${airwaybill}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Filter cargo bills based on search query
  const filteredCargoBills = cargoBills.filter((bill) => {
    const query = searchQuery.toLowerCase();
    return (
      bill.airwaybill?.toLowerCase().includes(query) ||
      bill.customerName?.toLowerCase().includes(query) ||
      bill.customerEmail?.toLowerCase().includes(query) ||
      bill.origin?.city?.toLowerCase().includes(query) ||
      bill.destination?.city?.toLowerCase().includes(query)
    );
  });

  if (loading) return <p>Loading cargo airwaybills...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="cargo-list">
      <h2>All Cargo Airwaybills</h2>

      {/* ✅ Top bar with Create button + Search */}
      <div className="top-bar">
        <Link to="/cargocharters/create" className="cargo-list-create-btn">
          + Create New Cargo Airwaybill
        </Link>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search airwaybill, customer, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>


      {filteredCargoBills.length === 0 ? (
        <p>No cargo airwaybills found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Airwaybill</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Weight (kg)</th>
                <th>Qty</th>
                <th>Dimensions (L×W×H cm)</th>
                <th>Volume (cm³)</th>
                <th>Description</th>
                <th>Price (USD)</th>
                <th>Status</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Withdraw Reason</th>
                <th>Withdrawn At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCargoBills.map((bill) => (
                <tr key={bill.airwaybill}>
                  <td data-label="Airwaybill">{bill.airwaybill}</td>
                  <td data-label="Customer">{bill.customerName || "-"}</td>
                  <td data-label="Email">{bill.customerEmail || "-"}</td>
                  <td data-label="Origin">
                    {bill.origin?.city || "-"}, {bill.origin?.country || ""}
                  </td>
                  <td data-label="Destination">
                    {bill.destination?.city || "-"}, {bill.destination?.country || ""}
                  </td>
                  <td data-label="Weight (kg)">{bill.cargoDetails?.weight || 0}</td>
                  <td data-label="Qty">{bill.cargoDetails?.quantity || 0}</td>
                  <td data-label="Dimensions (L×W×H cm)">
                    {bill.cargoDetails
                      ? `${bill.cargoDetails.length || 0} × ${bill.cargoDetails.width || 0} × ${bill.cargoDetails.height || 0}`
                      : "-"}
                  </td>
                  <td data-label="Volume (cm³)">
                    {bill.cargoDetails?.volume?.toLocaleString() || 0}
                  </td>
                  <td data-label="Description">{bill.cargoDetails?.description || "-"}</td>
                  <td data-label="Price (USD)">{bill.price?.toLocaleString() || 0}</td>
                  <td data-label="Status">
                    <div
                      className={`status-badge ${bill.status?.toLowerCase().replace(" ", "-")}`}
                    >
                      {bill.status}
                    </div>
                  </td>
                  <td data-label="Departure">{formatDate(bill.departureDate)}</td>
                  <td data-label="Arrival">{formatDate(bill.arrivalDate)}</td>
                  <td data-label="Withdraw Reason">{bill.withdrawReason || "-"}</td>
                  <td data-label="Withdrawn At">{formatDate(bill.withdrawnAt)}</td>
                  <td data-label="Actions" className="actions-cell">
                    <Link to={`/cargocharters/edit/${bill.airwaybill}`}>
                      <button className="cargo-list-edit-btn">Edit</button>
                    </Link>

                    {bill.status === "Withdrawn" && (
                      <button
                        onClick={() => downloadReceipt(bill.airwaybill)}
                        className="cargo-list-download-btn"
                      >
                        Download Receipt
                      </button>
                    )}
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

export default CargoList;
