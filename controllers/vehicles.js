const express = require("express");
const router = express.Router();
const Vehicle = require("../models/vehicle");
const verifyToken = require("../middleware/verify-token");

// Create
router.post("/", verifyToken, async (req, res) => {
  try {
    const { make, model, year } = req.body;
    const userId = req.user._id;

    const vehicle = new Vehicle({
      make,
      model,
      year,
      user: userId,
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all vehicles for the authenticated user
router.get("/", verifyToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user._id });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific vehicle by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found." });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found." });

    vehicle.make = req.body.make || vehicle.make;
    vehicle.model = req.body.model || vehicle.model;
    vehicle.year = req.body.year || vehicle.year;

    await vehicle.save();
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found." });

    await vehicle.remove();
    res.status(200).json({ message: "Vehicle deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
