import mongoose from "mongoose";

// 📍 Reusable location schema
const locationSchema = new mongoose.Schema(
  {
    city: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    displayName: { type: String, trim: true },
  },
  { _id: false }
);

// 👤 Individual passenger schema (onboard passengers)
const passengerOnboardSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    passportNo: { type: String, default: "", trim: true },
    idNo: { type: String, default: "", trim: true },
    seatNo: { type: String, default: "", trim: true },
    age: { type: Number, default: null, min: 0 },
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
  },
  { _id: false }
);

// 🛫 Route checkpoint schema
const passengerRoutePointSchema = new mongoose.Schema(
  {
    city: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    displayName: { type: String, trim: true },
    note: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// 📍 Default JKIA Nairobi location
const defaultJKIALocation = {
  city: "Nairobi",
  coordinates: { lat: -1.319167, lng: 36.9275 },
  displayName: "JKIA Nairobi, Kenya",
};

// 🛩 Passenger main schema
const passengerSchema = new mongoose.Schema(
  {
    airwaybill: { type: String, required: true, unique: true, index: true },

    // Client Info (the person who booked)
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: null, trim: true },

    // Trip Info
    origin: { type: locationSchema, required: true },
    destination: { type: locationSchema, required: true },

    // Passengers onboard (editable)
    passengerDetails: {
      numberOfPassengers: { type: Number, default: 0, min: 0 },
      passengerList: { type: [passengerOnboardSchema], default: [] },
    },

    // Ticket & Requests
    ticketClass: {
      type: String,
      enum: ["Economy", "Business", "First"],
      default: "Economy",
    },
    specialRequests: { type: String, default: null, trim: true },

    // Status Tracking
    status: {
      type: String,
      enum: ["Booked", "Checked In", "In Transit", "Arrived", "Cancelled"],
      default: "Booked",
    },

    // Financials
    price: { type: Number, default: 0, min: 0 },

    // Dates
    departureDate: { type: Date },
    arrivalDate: { type: Date },
    deliveredAt: { type: Date },

    // Route History
    route: { type: [passengerRoutePointSchema], default: [] },

    // Current Location (default JKIA)
    currentLocation: { type: locationSchema, default: defaultJKIALocation },
  },
  { timestamps: true }
);

// Optional: auto-update numberOfPassengers before saving
passengerSchema.pre("save", function (next) {
  if (this.passengerDetails?.passengerList?.length != null) {
    this.passengerDetails.numberOfPassengers = this.passengerDetails.passengerList.length;
  } else {
    this.passengerDetails.numberOfPassengers = 0;
  }
  next();
});

export default mongoose.model("Passenger", passengerSchema);
