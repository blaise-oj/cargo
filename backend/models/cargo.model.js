import mongoose from "mongoose";

// Schema for checkpoints (route history)
const cargoRoutePointSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    status: {
      type: String,
      enum: ["Booked", "Checked In", "In Transit", "Arrived", "Withdrawn"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: false }
);

// Schema for locations (origin, destination, currentLocation)
const cargoLocationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Schema for cargo details
const cargoDetailsSchema = new mongoose.Schema(
  {
    description: { type: String, default: "" },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

// Main cargo schema
const cargoSchema = new mongoose.Schema(
  {
    airwaybill: { type: String, required: true, unique: true },
    charterType: { type: String, default: "cargo" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },

    // Structured locations
    origin: { type: cargoLocationSchema, required: true },
    destination: { type: cargoLocationSchema, required: true },
    currentLocation: { type: cargoLocationSchema, default: null },

    cargoDetails: { type: cargoDetailsSchema, required: true },

    status: {
      type: String,
      enum: ["Booked", "Checked In", "In Transit", "Arrived", "Withdrawn"],
      default: "Booked",
    },

    price: { type: Number, default: 0 },
    departureDate: { type: Date, default: null },
    arrivalDate: { type: Date, default: null },
    withdrawnAt: { type: Date, default: null },
    withdrawReason: { type: String, default: "" },

    // Route history
    route: { type: [cargoRoutePointSchema], default: [] },
  },
  { timestamps: true }
);

const Cargo = mongoose.models.Cargo || mongoose.model("Cargo", cargoSchema);
export default Cargo;
