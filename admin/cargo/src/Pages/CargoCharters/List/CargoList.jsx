import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CargoList.css";

const CargoList = () => {
  const [cargoBills, setCargoBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Format date to East African Time (24h with hrs)
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

  // Fetch cargo list
  const fetchCargoBills = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cargo");
      if (!res.ok) throw new Error("Failed to fetch cargo airwaybills");
      const data = await res.json();

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

  // Handle receipt download
  const downloadReceipt = async (airwaybill) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/cargo/${airwaybill}/receipt`,
        { method: "GET" }
      );

      if (!res.ok) {
        throw new Error("Failed to download receipt");
      }

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

  if (loading) return <p>Loading cargo airwaybills...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="cargo-list">
      <h2>All Cargo Airwaybills</h2>
      <Link to="/cargocharters/create" className="create-btn">
        + Create New Cargo Airwaybill
      </Link>

      {cargoBills.length === 0 ? (
        <p>No cargo airwaybills found.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Airwaybill</th>
                <th>Customer</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Withdrawn</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cargoBills.map((bill) => (
                <tr key={bill.airwaybill}>
                  <td data-label="Airwaybill">{bill.airwaybill}</td>
                  <td data-label="Customer">{bill.customerName || "-"}</td>
                  <td data-label="Origin">
                    {bill.origin?.city || "-"}, {bill.origin?.country || ""}
                  </td>
                  <td data-label="Destination">
                    {bill.destination?.city || "-"},{" "}
                    {bill.destination?.country || ""}
                  </td>
                  <td data-label="Status">
                    <div className={`status-badge ${bill.status
                      .toLowerCase()
                      .replace(" ", "-")}`}>
                      {bill.status}
                    </div>
                  </td>
                  <td data-label="Departure">{formatDate(bill.departureDate)}</td>
                  <td data-label="Arrival">{formatDate(bill.arrivalDate)}</td>
                  <td data-label="Withdrawn">{formatDate(bill.withdrawnAt)}</td>
                  <td data-label="Actions" className="actions-cell">
                    <Link to={`/cargocharters/edit/${bill.airwaybill}`}>
                      <button className="edit-btn">Edit</button>
                    </Link>
                    {bill.status === "Withdrawn" && (
                      <button
                        onClick={() => downloadReceipt(bill.airwaybill)}
                        className="download-btn"
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
