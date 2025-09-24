import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  // State for airwaybill modal
  const [selectedAwb, setSelectedAwb] = useState(null);
  // State for flight modal
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Sample data for charts
  const monthlyData = [
    { month: "Jan", cargo: 30, passenger: 45 },
    { month: "Feb", cargo: 20, passenger: 35 },
    { month: "Mar", cargo: 45, passenger: 55 },
    { month: "Apr", cargo: 32, passenger: 42 },
    { month: "May", cargo: 50, passenger: 65 },
    { month: "Jun", cargo: 60, passenger: 70 },
  ];

  // Mock recent airwaybills
  const recentAirwaybills = [
    { id: "CARGO_53BBD3070F82", type: "Cargo", route: "NBO → DXB", status: "Pending", weight: "12,000kg", customer: "Emirates SkyCargo" },
    { id: "PASS_FAD9D9E7F361", type: "Passenger", route: "LHR → JFK", status: "Completed", passengers: 220, customer: "Kenya Airways" },
    { id: "CARGO_A6408C16E936", type: "Cargo", route: "NBO → AMS", status: "In Transit", weight: "8,500kg", customer: "KLM Cargo" },
  ];

  // Mock upcoming flights
  const upcomingFlights = [
    { id: "FL001", type: "Cargo", route: "NBO → FRA", date: "2025-09-28", time: "10:30", aircraft: "Boeing 777F", operator: "Lufthansa Cargo" },
    { id: "FL002", type: "Passenger", route: "DXB → NBO", date: "2025-09-29", time: "14:45", aircraft: "Boeing 787-9", operator: "Kenya Airways" },
    { id: "FL003", type: "Cargo", route: "HKG → NBO", date: "2025-09-30", time: "06:15", aircraft: "Airbus A330F", operator: "Cathay Pacific Cargo" },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of cargo & passenger operations</p>
      </header>

      {/* KPI Cards */}
      <section className="dashboard-metrics">
        <div className="metric-card">
          <h2>120</h2>
          <p>Total Cargo Charters</p>
        </div>
        <div className="metric-card">
          <h2>85</h2>
          <p>Total Passenger Charters</p>
        </div>
        <div className="metric-card">
          <h2>34</h2>
          <p>Pending Airwaybills</p>
        </div>
        <div className="metric-card">
          <h2>171</h2>
          <p>Completed Flights</p>
        </div>
      </section>

      {/* Charts */}
      <section className="dashboard-charts">
        <div className="chart-card">
          <h3>Cargo vs Passenger Charters</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cargo" fill="#05469b" />
              <Bar dataKey="passenger" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cargo" stroke="#05469b" strokeWidth={2} />
              <Line type="monotone" dataKey="passenger" stroke="#38bdf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tables */}
      <section className="dashboard-tables">
        {/* Airwaybills */}
        <div className="table-card">
          <h3>Recent Airwaybills</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Route</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAirwaybills.map((awb) => (
                <tr key={awb.id} onClick={() => setSelectedAwb(awb)} className="clickable-row">
                  <td className="link-cell">{awb.id}</td>
                  <td>{awb.type}</td>
                  <td>{awb.route}</td>
                  <td>{awb.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Flights */}
        <div className="table-card">
          <h3>Upcoming Flights</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Route</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {upcomingFlights.map((flight) => (
                <tr key={flight.id} onClick={() => setSelectedFlight(flight)} className="clickable-row">
                  <td className="link-cell">{flight.id}</td>
                  <td>{flight.type}</td>
                  <td>{flight.route}</td>
                  <td>{flight.date}</td>
                  <td>{flight.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Airwaybill Modal */}
      {selectedAwb && (
        <div className="modal-backdrop" onClick={() => setSelectedAwb(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAwb(null)}>×</button>
            <h2>Airwaybill Details</h2>
            <p><strong>ID:</strong> {selectedAwb.id}</p>
            <p><strong>Type:</strong> {selectedAwb.type}</p>
            <p><strong>Route:</strong> {selectedAwb.route}</p>
            <p><strong>Status:</strong> {selectedAwb.status}</p>
            {selectedAwb.weight && <p><strong>Weight:</strong> {selectedAwb.weight}</p>}
            {selectedAwb.passengers && <p><strong>Passengers:</strong> {selectedAwb.passengers}</p>}
            <p><strong>Customer:</strong> {selectedAwb.customer}</p>
          </div>
        </div>
      )}

      {/* Flight Modal */}
      {selectedFlight && (
        <div className="modal-backdrop" onClick={() => setSelectedFlight(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedFlight(null)}>×</button>
            <h2>Flight Details</h2>
            <p><strong>ID:</strong> {selectedFlight.id}</p>
            <p><strong>Type:</strong> {selectedFlight.type}</p>
            <p><strong>Route:</strong> {selectedFlight.route}</p>
            <p><strong>Date:</strong> {selectedFlight.date}</p>
            <p><strong>Time:</strong> {selectedFlight.time}</p>
            <p><strong>Aircraft:</strong> {selectedFlight.aircraft}</p>
            <p><strong>Operator:</strong> {selectedFlight.operator}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


