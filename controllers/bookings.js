const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Vehicle = require("../models/vehicle");
const User = require("../models/user");
const verifyToken = require("../middleware/verify-token");
const dayjs = require("dayjs");

router.post("/", verifyToken, async (req, res) => {
  try {
    const { date, timeSlot, vehicleId, serviceId } = req.body;

    if (!vehicleId || !serviceId) {
      return res
        .status(400)
        .json({ error: "Vehicle and Service are required." });
    }

    const formattedDate = dayjs(date).format("YYYY-MM-DD HH:mm:ss");

    const booking = new Booking({
      date: formattedDate,
      timeSlot,
      user: req.user._id,
      vehicle: vehicleId,
      service: serviceId,
    });

    await booking.save();

    await User.findByIdAndUpdate(req.user._id, { $push: { bookings: booking._id } });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "vehicle service"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "vehicle service"
    );
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found." });

    booking.date = req.body.date
      ? dayjs(req.body.date).format("YYYY-MM-DD HH:mm:ss")
      : booking.date;
    booking.timeSlot = req.body.timeSlot || booking.timeSlot;
    booking.status = req.body.status || booking.status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    await User.findByIdAndUpdate(booking.user, { $pull: { bookings: booking._id } });

    res.status(200).json({ message: "Booking deleted and removed from user successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
