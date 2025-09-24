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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./ReportsAnalytics.css";

const ReportsAnalytics = () => {
  // State for filters
  const [reportType, setReportType] = useState("cargo");
  const [dateRange, setDateRange] = useState("last30");

  // Sample data
  const revenueData = [
    { month: "Jan", cargo: 12000, passenger: 8000 },
    { month: "Feb", cargo: 15000, passenger: 9500 },
    { month: "Mar", cargo: 18000, passenger: 12000 },
    { month: "Apr", cargo: 17000, passenger: 10000 },
    { month: "May", cargo: 21000, passenger: 14000 },
    { month: "Jun", cargo: 25000, passenger: 16000 },
  ];

  const cargoBreakdown = [
    { name: "Perishables", value: 4000 },
    { name: "Electronics", value: 3000 },
    { name: "Pharmaceuticals", value: 2000 },
    { name: "General Cargo", value: 5000 },
  ];

  const COLORS = ["#05469b", "#38bdf8", "#22c55e", "#f59e0b"];

  return (
    <div className="reports">
      {/* Header */}
      <header className="reports-header">
        <h1>Reports & Analytics</h1>
        <p>Insights into cargo and passenger charter performance</p>
      </header>

      {/* Filters */}
      <section className="reports-filters">
        <div className="filter-group">
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="cargo">Cargo</option>
            <option value="passenger">Passenger</option>
            <option value="combined">Combined</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <button className="download-btn">⬇ Download Report</button>
      </section>

      {/* KPIs */}
      <section className="reports-metrics">
        <div className="metric-card">
          <h2>$250,000</h2>
          <p>Total Revenue</p>
        </div>
        <div className="metric-card">
          <h2>320</h2>
          <p>Total Airwaybills</p>
        </div>
        <div className="metric-card">
          <h2>145</h2>
          <p>Cargo Flights</p>
        </div>
        <div className="metric-card">
          <h2>175</h2>
          <p>Passenger Flights</p>
        </div>
      </section>

      {/* Charts */}
      <section className="reports-charts">
        {/* Revenue Trend */}
        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
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

        {/* Cargo Breakdown */}
        <div className="chart-card">
          <h3>Cargo Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={cargoBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {cargoBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default ReportsAnalytics;

