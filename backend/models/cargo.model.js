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
      enum: ["Booked", "Checked In", "Delayed", "In Transit", "Arrived", "Withdrawn"],
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
const partySchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    address: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
  },
  { _id: false }
);

const flightDetailsSchema = new mongoose.Schema(
  {
    airline: { type: String, default: "" },
    flightNumber: { type: String, default: "" },
    departureAirport: { type: String, default: "" },
    destinationAirport: { type: String, default: "" },
    departureTime: { type: String, default: "" },
  },
  { _id: false }
);

const awbDetailsSchema = new mongoose.Schema(
  {
    issuedBy: { type: String, default: "Airrush Charters Ltd" },
    issuingCarrierAgent: { type: String, default: "" },
    agentIataCode: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    airportOfDeparture: { type: String, default: "" },
    airportOfDestination: { type: String, default: "" },
    routingTo: { type: String, default: "" },
    routingBy: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    declaredValueCarriage: { type: String, default: "NVD" },
    declaredValueCustoms: { type: String, default: "NCV" },
    insuranceAmount: { type: String, default: "" },
    handlingInformation: { type: String, default: "" },
    accountingInformation: { type: String, default: "" },
    shipperSignature: { type: String, default: "" },
    carrierSignature: { type: String, default: "" },
    executedAtPlace: { type: String, default: "" },
    executedOnDate: { type: Date, default: null },
  },
  { _id: false }
);

const chargesSchema = new mongoose.Schema(
  {
    rateClass: { type: String, default: "" },
    chargeableWeight: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    weightCharge: { type: Number, default: 0 },
    valuationCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalOtherChargesDueAgent: { type: Number, default: 0 },
    totalOtherChargesDueCarrier: { type: Number, default: 0 },
    totalPrepaid: { type: Number, default: 0 },
    totalCollect: { type: Number, default: 0 },
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
    pieces: { type: String, default: "" },
    natureOfGoods: { type: String, default: "" },
    commodityItemNumber: { type: String, default: "" },
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
    shipper: { type: partySchema, default: () => ({}) },
    consignee: { type: partySchema, default: () => ({}) },
    origin: { type: cargoLocationSchema, required: true },
    destination: { type: cargoLocationSchema, required: true },
    flightDetails: { type: flightDetailsSchema, default: () => ({}) },
    awbDetails: { type: awbDetailsSchema, default: () => ({}) },
    charges: { type: chargesSchema, default: () => ({}) },
    currentLocation: { type: cargoLocationSchema, default: null },
    cargoDetails: { type: cargoDetailsSchema, required: true },
    status: {
      type: String,
      enum: ["Booked", "Checked In", "Delayed", "In Transit", "Arrived", "Withdrawn"],
      default: "Booked",
    },
    price: { type: Number, default: 0 },
    departureDate: { type: Date, default: null },
    arrivalDate: { type: Date, default: null },
    delayedAt: { type: Date, default: null },
    delayReason: { type: String, default: "" },

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
