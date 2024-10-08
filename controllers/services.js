const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const verifyToken = require("../middleware/verify-token");

// Create
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const service = new Service({
      name,
      description,
      price,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all ACTIVE services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    service.name = req.body.name || service.name;
    service.description = req.body.description || service.description;
    service.price = req.body.price || service.price;

    await service.save();
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Disable
router.put("/:id/disable", verifyToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    service.isActive = false; // Mark the service as inactive
    await service.save();
    res.status(200).json({ message: "Service disabled successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enable
router.put("/:id/activate", verifyToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    service.isActive = true; // Mark the service as active
    await service.save();
    res.status(200).json({ message: "Service reactivated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
