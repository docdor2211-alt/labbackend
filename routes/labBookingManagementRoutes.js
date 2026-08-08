const express = require("express");

const router = express.Router();

const {

  getAllLabBookings,

  updateLabBookingStatus,

} = require(
  "../controllers/labBookingManagementController"
);

const {

  protect,

  laboratoryOnly,

} = require(
  "../middleware/authMiddleware"
);


// ======================================================
// GET ALL LAB BOOKINGS
// ======================================================

router.get(
  "/bookings",
  protect,
  laboratoryOnly,
  getAllLabBookings
);


// ======================================================
// CONFIRM / CANCEL BOOKING
// ======================================================

router.put(
  "/update-status/:id",
  protect,
  laboratoryOnly,
  updateLabBookingStatus
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;