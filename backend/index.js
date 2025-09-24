import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Import routes
import cargoRoutes from "./routes/cargo.routes.js";
import passengerRoutes from "./routes/passenger.routes.js";

// Connect to database
console.log(
  `🌐 NODE_ENV: ${process.env.NODE_ENV || "development"}`
);
console.log(
  `🌐 Connecting to DB: ${process.env.NODE_ENV === "production" ? "PROD" : "DEV"} URI`
);

connectDB();

// App config
const app = express();
const port = process.env.PORT || 4000; // Render assigns PORT automatically

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/cargo", cargoRoutes);
app.use("/api/passengers", passengerRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
