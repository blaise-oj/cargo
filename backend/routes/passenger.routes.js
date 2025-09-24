import express from "express";
import { 
  createPassenger, 
  getPassengers, 
  getPassengerByAirwaybill, 
  updatePassengerByAirwaybill, 
  addPassengerCheckpoint,
  deletePassengerByAirwaybill 
} from "../controllers/passenger.controller.js";

const router = express.Router();

/**
 * @route   POST /api/passengers
 * @desc    Create a new passenger booking
 */
router.post("/", createPassenger);

/**
 * @route   GET /api/passengers
 * @desc    Get all passengers (newest first)
 */
router.get("/", getPassengers);

/**
 * @route   GET /api/passengers/track/:airwaybill
 * @desc    Get passenger details by airwaybill
 */
router.get("/track/:airwaybill", getPassengerByAirwaybill);

/**
 * @route   PUT /api/passengers/track/:airwaybill
 * @desc    Update passenger details by airwaybill
 */
router.put("/track/:airwaybill", updatePassengerByAirwaybill);

/**
 * @route   DELETE /api/passengers/track/:airwaybill
 * @desc    Delete passenger by airwaybill
 */
router.delete("/track/:airwaybill", deletePassengerByAirwaybill); 

/**
 * @route   POST /api/passengers/track/:airwaybill/locations
 * @desc    Add a checkpoint/location to a passenger’s journey
 */
router.post("/track/:airwaybill/locations", addPassengerCheckpoint);

export default router;
