// controllers/cargoController.js
import Cargo from "../models/cargo.model.js";
import crypto from "crypto";
import { generateReceiptPDF } from "../utils/receiptGenerator.js";
import { sendCargoStatusEmail } from "../utils/emailService.js";

// Generate airwaybill in the format: CARGO_<12-char random code>
const generateAirwaybill = () => {
  const randomCode = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `CARGO_${randomCode}`;
};

// ✅ Create Cargo Airwaybill
export const createCargo = async (req, res) => {
  try {
    const airwaybill = generateAirwaybill();

    const {
      origin,
      destination,
      customerName,
      customerEmail,
      cargoDetails,
      price,
      departureDate,
      arrivalDate,
    } = req.body;

    if (!origin || !destination)
      return res.status(400).json({ message: "Origin and destination are required" });

    const cargo = new Cargo({
      airwaybill,
      origin,
      destination,
      customerName,
      customerEmail,
      cargoDetails,
      status: "Booked",
      price,
      departureDate: departureDate || null,
      arrivalDate: arrivalDate || null,
      currentLocation: origin,
      route: [
        {
          ...origin,
          status: "Booked",
          note: "Cargo created",
          timestamp: new Date(),
        },
      ],
    });

    await cargo.save();
    await sendCargoStatusEmail(cargo); // Send email on creation

    res.status(201).json(cargo);
  } catch (err) {
    console.error("❌ Cargo creation failed:", err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get all cargo
export const getCargo = async (req, res) => {
  try {
    const cargos = await Cargo.find().sort({ createdAt: -1 });
    res.json(cargos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get cargo by airwaybill (user)
export const getCargoByAirwaybill = async (req, res) => {
  try {
    const cargo = await Cargo.findOne({ airwaybill: req.params.airwaybill });
    if (!cargo)
      return res.status(404).json({ success: false, message: "Cargo not found" });
    res.json({ success: true, cargo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get cargo by airwaybill (admin)
export const getCargoByAirwaybillAdmin = async (req, res) => {
  try {
    const cargo = await Cargo.findOne({ airwaybill: req.params.airwaybill });
    if (!cargo) return res.status(404).json({ message: "Cargo not found" });
    res.json(cargo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update cargo info (admin)
export const updateCargoByAirwaybill = async (req, res) => {
  try {
    const { airwaybill } = req.params;
    const cargo = await Cargo.findOne({ airwaybill });
    if (!cargo) return res.status(404).json({ message: "Cargo not found" });

    const allowedFields = [
      "customerName",
      "customerEmail",
      "origin",
      "destination",
      "cargoDetails",
      "price",
      "departureDate",
      "arrivalDate",
      "currentLocation",
      "status",
      "withdrawnAt",
    ];

    let routeUpdated = false;

    // Update allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        cargo[field] = req.body[field];
        if (["currentLocation", "status"].includes(field)) routeUpdated = true;
      }
    });

    // Safely push route entry if location/status updated
    if (routeUpdated && cargo.currentLocation) {
      const { city, country, lat, lng } = cargo.currentLocation;
      if (city && country && lat != null && lng != null) {
        cargo.route.push({
          city,
          country,
          lat,
          lng,
          status: cargo.status,
          note: "Cargo updated by admin",
          timestamp: new Date(),
        });
      } else {
        console.warn(
          "Skipped adding route entry: incomplete currentLocation data",
          cargo.currentLocation
        );
      }
    }

    await cargo.save();
    await sendCargoStatusEmail(cargo); // Send email on update

    res.json(cargo);
  } catch (err) {
    console.error("Error updating cargo:", err);
    res.status(500).json({ message: "Cargo update failed", error: err.message });
  }
};

// ✅ Update Cargo Status
export const updateCargoStatus = async (req, res) => {
  try {
    const { airwaybill } = req.params;
    const { status, currentLocation } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });
    if (
      !currentLocation ||
      !currentLocation.city ||
      !currentLocation.country ||
      currentLocation.lat == null ||
      currentLocation.lng == null
    )
      return res.status(400).json({
        message: "Current location with city, country, lat, lng is required",
      });

    const cargo = await Cargo.findOne({ airwaybill });
    if (!cargo) return res.status(404).json({ message: "Cargo not found" });

    cargo.status = status;
    cargo.currentLocation = { ...currentLocation, updatedAt: new Date() };

    cargo.route.push({
      ...currentLocation,
      status,
      note: `Status updated to ${status}`,
      timestamp: new Date(),
    });

    if (status === "Arrived") cargo.arrivalDate = new Date();
    if (status === "Withdrawn") cargo.withdrawnAt = new Date();

    await cargo.save();
    await sendCargoStatusEmail(cargo);

    res.json({ message: "Cargo status updated", cargo });
  } catch (err) {
    console.error("Error updating cargo status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Withdraw cargo
export const markCargoWithdrawn = async (req, res) => {
  try {
    const cargo = await Cargo.findOne({ airwaybill: req.params.airwaybill });
    if (!cargo) return res.status(404).json({ message: "Cargo not found" });

    if (cargo.status !== "Arrived")
      return res.status(400).json({ message: "Cargo can only be withdrawn after arrival" });

    cargo.status = "Withdrawn";
    cargo.withdrawnAt = new Date();
    cargo.route.push({
      ...cargo.currentLocation,
      status: "Withdrawn",
      timestamp: new Date(),
      note: "Cargo withdrawn",
    });

    await cargo.save();
    await sendCargoStatusEmail(cargo);

    res.json({ message: "Cargo withdrawn successfully", cargo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete cargo
export const deleteCargoByAirwaybill = async (req, res) => {
  try {
    const deleted = await Cargo.findOneAndDelete({ airwaybill: req.params.airwaybill });
    if (!deleted) return res.status(404).json({ message: "Cargo not found" });
    res.json({ message: "Cargo deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Download receipt
export const downloadCargoReceipt = async (req, res) => {
  const { airwaybill } = req.params;

  try {
    const cargo = await Cargo.findOne({ airwaybill });
    if (!cargo) return res.status(404).json({ message: "Cargo not found" });

    if (cargo.status !== "Withdrawn")
      return res.status(400).json({ message: "Receipt is only available after withdrawal" });

    const pdfBuffer = await generateReceiptPDF(cargo);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Receipt_${airwaybill}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
