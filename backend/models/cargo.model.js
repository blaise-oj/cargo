import mongoose from "mongoose";
import countries from "i18n-iso-countries";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// ✅ Register English locale safely (no JSON import issues)
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

// ===== Checkpoint Schema =====
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

// ===== Location Schema =====
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

// ===== Cargo Details Schema =====
const cargoDetailsSchema = new mongoose.Schema(
  {
    description: { type: String, default: "" },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
    length: { type: Number, default: 0 }, // cm
    width: { type: Number, default: 0 },  // cm
    height: { type: Number, default: 0 }, // cm
    volume: { type: Number, default: 0 }, // cm³
  },
  { _id: false }
);

// ===== Main Cargo Schema =====
const cargoSchema = new mongoose.Schema(
  {
    airwaybill: { type: String, required: true, unique: true },
    charterType: { type: String, default: "cargo" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
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
    route: { type: [cargoRoutePointSchema], default: [] },
  },
  { timestamps: true }
);

// ===== Pre-save hook: calculate volume & expand country codes =====
cargoSchema.pre("save", function (next) {
  // Auto-calculate cargo volume
  if (this.cargoDetails) {
    const { length, width, height } = this.cargoDetails;
    this.cargoDetails.volume =
      length && width && height ? length * width * height : 0;
  }

  // Helper to convert "KE" -> "Kenya"
  const convertCountry = (loc) => {
    if (loc?.country && loc.country.length === 2) {
      const full = countries.getName(loc.country.toUpperCase(), "en");
      if (full) loc.country = full;
    }
  };

  // Apply to all relevant fields
  if (this.origin) convertCountry(this.origin);
  if (this.destination) convertCountry(this.destination);
  if (this.currentLocation) convertCountry(this.currentLocation);
  if (this.route?.length) this.route.forEach(convertCountry);

  next();
});

// ===== Export Model =====
const Cargo = mongoose.models.Cargo || mongoose.model("Cargo", cargoSchema);
export default Cargo;
