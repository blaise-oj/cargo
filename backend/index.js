import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Import routes
import cargoRoutes from "./routes/cargo.routes.js";
import passengerRoutes from "./routes/passenger.routes.js";

// Connect to database
console.log(`🌐 NODE_ENV: ${process.env.NODE_ENV || "development"}`);
console.log(
  `🌐 Connecting to DB: ${
    process.env.NODE_ENV === "production" ? "PROD" : "DEV"
  } URI`
);

connectDB();

// App config
const app = express();
const port = process.env.PORT || 4000;

// ---------- MIDDLEWARES ----------

// Parse JSON
app.use(express.json());

// ✅ CORS CONFIG (FIXES YOUR ISSUE)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  /^http:\/\/localhost:\d+$/,
  "https://www.airrushcharters.com",
  "https://airrushcharters.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ---------- ROUTES ----------

app.use("/api/cargo", cargoRoutes);
app.use("/api/passengers", passengerRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ---------- SERVER ----------

app.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
});
