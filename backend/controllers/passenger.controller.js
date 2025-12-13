import Passenger from "../models/passenger.model.js";
import crypto from "crypto";
import fetch from "node-fetch";
import { sendStatusEmail } from "../utils/emailService.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import countries from "i18n-iso-countries";
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

/** Default JKIA Nairobi location */
const DEFAULT_JKIA = {
  city: "Nairobi",
  coordinates: { lat: -1.319167, lng: 36.9275 },
  displayName: "JKIA Nairobi, Kenya",
};

/** Generate airwaybill */
const generateAirwaybill = () => {
  const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `PASS_${randomPart}`;
};

/** In-memory cache for geocoding */
const geoCache = new Map();

/** Geocode city using Google or Nominatim */
export const geocodeCity = async (cityRaw) => {
  if (!cityRaw || typeof cityRaw !== "string") return null;
  const city = cityRaw.trim();
  if (!city) return null;

  const key = city.toLowerCase();
  if (geoCache.has(key)) return geoCache.get(key);

  const GOOGLE_KEY = process.env.GOOGLE_GEOCODE_API_KEY;
  if (GOOGLE_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        city
      )}&key=${GOOGLE_KEY}`;
      const resp = await fetch(url);
      const json = await resp.json();
      if (json.status === "OK" && json.results?.length) {
        const r = json.results[0];
        const coords = {
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
          displayName: r.formatted_address,
        };
        geoCache.set(key, coords);
        return coords;
      }
    } catch (err) {
      console.warn("Google geocode failed, falling back:", err.message);
    }
  }

  try {
    const NOMINATIM_USER_AGENT =
      process.env.NOMINATIM_USER_AGENT || "PassengerApp/1.0 (contact@example.com)";
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      city
    )}&limit=1`;
    const resp = await fetch(url, { headers: { "User-Agent": NOMINATIM_USER_AGENT } });
    const json = await resp.json();
    if (Array.isArray(json) && json.length) {
      const place = json[0];
      const coords = {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        displayName: place.display_name || city,
      };
      geoCache.set(key, coords);
      return coords;
    }
    return null;
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
};

/** Normalize country name from code or full name */
const normalizeCountry = (value) => {
  if (!value || typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  const fullName = countries.getName(code, "en");
  return fullName || value.trim();
};

/** Normalize location input */
const resolveLocationInput = async (input, fallbackDefault = null) => {
  if (!input && fallbackDefault) return fallbackDefault;

  let cityCandidate = null;
  let countryCandidate = null;

  if (typeof input === "object" && input !== null) {
    cityCandidate = input.city?.trim() || input.displayName?.split(",")[0]?.trim() || "Unknown";

    // Detect country code or full country
    if (input.country) countryCandidate = normalizeCountry(input.country);
    else if (input.displayName?.includes(",")) {
      const parts = input.displayName.split(",");
      const lastPart = parts[parts.length - 1].trim();
      countryCandidate = normalizeCountry(lastPart);
    }

    if (input.coordinates?.lat != null && input.coordinates?.lng != null) {
      const displayName = countryCandidate
        ? `${cityCandidate}, ${countryCandidate}`
        : input.displayName || cityCandidate;
      return {
        city: cityCandidate,
        coordinates: { lat: input.coordinates.lat, lng: input.coordinates.lng },
        displayName,
        country: countryCandidate || null,
      };
    }

    const geoc = await geocodeCity(cityCandidate);
    if (!geoc) return fallbackDefault;
    const displayName = countryCandidate
      ? `${cityCandidate}, ${countryCandidate}`
      : geoc.displayName || cityCandidate;
    return {
      city: cityCandidate,
      coordinates: { lat: geoc.lat, lng: geoc.lng },
      displayName,
      country: countryCandidate || null,
    };
  }

  if (typeof input === "string") {
    const parts = input.split(",");
    cityCandidate = parts[0].trim();
    countryCandidate = parts.length > 1 ? normalizeCountry(parts[1]) : null;

    const geoc = await geocodeCity(cityCandidate);
    if (!geoc) return fallbackDefault;
    const displayName = countryCandidate
      ? `${cityCandidate}, ${countryCandidate}`
      : geoc.displayName || cityCandidate;
    return {
      city: cityCandidate,
      coordinates: { lat: geoc.lat, lng: geoc.lng },
      displayName,
      country: countryCandidate || null,
    };
  }

  return fallbackDefault;
};

/* ---------------- Controller functions ---------------- */

/** CREATE passenger */
export const createPassenger = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      phone,
      origin,
      destination,
      ticketClass,
      specialRequests,
      passengerDetails,
      departureDate,
      arrivalDate,
      price,
    } = req.body;

    if (!customerName || !customerEmail)
      return res.status(400).json({ success: false, message: "Missing required fields: customerName/customerEmail" });

    const originResolved = await resolveLocationInput(origin, DEFAULT_JKIA);
    const destinationResolved = (await resolveLocationInput(destination)) || originResolved;

    const airwaybill = generateAirwaybill();

    const onboardPassengers =
      Array.isArray(passengerDetails?.passengerList) && passengerDetails.passengerList.length
        ? passengerDetails.passengerList
        : [];

    const passenger = new Passenger({
      airwaybill,
      customerName,
      customerEmail,
      phone: phone || null,
      ticketClass: ticketClass || "Economy",
      specialRequests: specialRequests || null,
      status: "Booked",
      origin: originResolved,
      destination: destinationResolved,
      departureDate: departureDate ? new Date(departureDate) : null,
      arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
      price: price ? parseFloat(price) : 0,
      currentLocation: { ...originResolved },
      passengerDetails: { numberOfPassengers: onboardPassengers.length, passengerList: onboardPassengers },
    });

    await passenger.save();
    try { await sendStatusEmail(passenger); } catch (err) { console.error("Email failed:", err.message); }

    res.status(201).json({ success: true, message: "Passenger created", data: passenger });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/** GET all passengers */
export const getPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find().sort({ createdAt: -1 });
    res.json({ success: true, data: passengers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

/** GET passenger by airwaybill */
export const getPassengerByAirwaybill = async (req, res) => {
  try {
    const passenger = await Passenger.findOne({ airwaybill: req.params.airwaybill });
    if (!passenger) return res.status(404).json({ success: false, message: "Passenger not found" });
    res.json({ success: true, data: passenger });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** UPDATE passenger by airwaybill */
export const updatePassengerByAirwaybill = async (req, res) => {
  try {
    const { airwaybill } = req.params;
    const incoming = { ...req.body };
    const updates = {};

    if (incoming.origin) {
      const resolved = await resolveLocationInput(incoming.origin);
      if (!resolved) return res.status(400).json({ success: false, message: "Invalid origin" });
      updates.origin = resolved;
      if (!incoming.currentLocation) updates.currentLocation = { ...resolved };
    }

    if (incoming.destination) {
      const resolved = await resolveLocationInput(incoming.destination);
      if (!resolved) return res.status(400).json({ success: false, message: "Invalid destination" });
      updates.destination = resolved;
    }

    if (incoming.currentLocation) {
      const resolved = await resolveLocationInput(incoming.currentLocation);
      if (!resolved) return res.status(400).json({ success: false, message: "Invalid current location" });
      updates.currentLocation = resolved;
    }

    const scalarFields = ["customerName", "customerEmail", "phone", "specialRequests", "ticketClass", "status", "departureDate", "arrivalDate", "price"];
    scalarFields.forEach((f) => {
      if (incoming[f] !== undefined) updates[f] = incoming[f];
    });

    if (incoming.passengerDetails) {
      const list =
        Array.isArray(incoming.passengerDetails.passengerList) && incoming.passengerDetails.passengerList.length
          ? incoming.passengerDetails.passengerList
          : [];
      updates.passengerDetails = { numberOfPassengers: list.length, passengerList: list };
    }

    const updated = await Passenger.findOneAndUpdate({ airwaybill }, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Passenger not found" });

    try { await sendStatusEmail(updated); } catch (err) { console.error("Email failed:", err.message); }

    res.json({ success: true, message: "Passenger updated", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/** ADD checkpoint to passenger route */
export const addPassengerCheckpoint = async (req, res) => {
  try {
    const { airwaybill } = req.params;
    const { city, coordinates, displayName, note } = req.body;

    const passenger = await Passenger.findOne({ airwaybill });
    if (!passenger) return res.status(404).json({ success: false, message: "Passenger not found" });

    if (!city || !coordinates?.lat || !coordinates?.lng)
      return res.status(400).json({ success: false, message: "Invalid checkpoint" });

    let country = null;
    if (displayName?.includes(",")) {
      const parts = displayName.split(",");
      const last = parts[parts.length - 1].trim();
      country = normalizeCountry(last);
    }

    const checkpoint = {
      city,
      coordinates,
      displayName: country ? `${city}, ${country}` : displayName || city,
      country,
      note: note || null,
      timestamp: new Date(),
    };

    passenger.route.push(checkpoint);
    passenger.currentLocation = { ...checkpoint };
    await passenger.save();

    res.json({ success: true, message: "Checkpoint added", data: passenger });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/** DELETE passenger by airwaybill */
export const deletePassengerByAirwaybill = async (req, res) => {
  try {
    const passenger = await Passenger.findOneAndDelete({ airwaybill: req.params.airwaybill });
    if (!passenger) return res.status(404).json({ success: false, message: "Passenger not found" });

    passenger.status = "Cancelled";
    try { await sendStatusEmail(passenger); } catch (err) { console.error("Email failed:", err.message); }

    res.json({ success: true, message: "Passenger deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
