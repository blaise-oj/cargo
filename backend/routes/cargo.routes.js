import express from "express";
import { 
  createCargo, 
  getCargo, 
  getCargoByAirwaybill, 
  getCargoByAirwaybillAdmin,   // 👈 admin fetch
  updateCargoByAirwaybill,
  deleteCargoByAirwaybill,
  updateCargoStatus,
  markCargoWithdrawn,
  downloadCargoReceipt
} from "../controllers/cargo.controller.js";

const router = express.Router();

// 📦 Create a new cargo airwaybill
router.post("/", createCargo);

// 📦 Get all cargo airwaybills
router.get("/", getCargo);

// 📦 User: Get a single cargo airwaybill by airwaybill number
router.get("/track/:airwaybill", getCargoByAirwaybill);

// 📦 Admin: Get a cargo airwaybill (direct object for edit form)
router.get("/admin/:airwaybill", getCargoByAirwaybillAdmin);

// ✏️ Update cargo details (admin edit)
router.put("/track/:airwaybill", updateCargoByAirwaybill);

// 🚚 Update cargo status and location
router.put("/track/:airwaybill/status", updateCargoStatus);

// 📦 Mark cargo as Withdrawn
router.put("/track/:airwaybill/withdraw", markCargoWithdrawn);

// ❌ Permanently delete cargo
router.delete("/:airwaybill", deleteCargoByAirwaybill);

// 📄 Download receipt
router.get("/:airwaybill/receipt", downloadCargoReceipt);

export default router;
