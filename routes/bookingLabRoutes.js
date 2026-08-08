// routes/bookingLabRoutes.js

const express = require("express");

const router = express.Router();

const {

  getAllBookings,
  getAllBookingsForRider,
  getSingleBooking,
  acceptBooking,
  rejectBooking,
  completeBooking,

  riderAcceptBooking,
  riderRejectBooking,

} = require(
  "../controllers/bookingLabController"
);

const {

  protect,

  laboratoryOnly,

} = require(
  "../middleware/authMiddleware"
);


// ======================================================
// GET ALL BOOKINGS
// ======================================================

router.get(
  "/all",
  protect,
  laboratoryOnly,
  getAllBookings
);

// ======================================
// RIDER GET ALL BOOKINGS
// NO TOKEN REQUIRED
// ======================================

router.get(
  "/all-orders",
  getAllBookingsForRider
);
// ======================================================
// GET SINGLE BOOKING
// ======================================================

router.get(
  "/:id",
  protect,
  laboratoryOnly,
  getSingleBooking
);


// ======================================================
// ACCEPT BOOKING
// ======================================================

router.put(
  "/accept/:id",
  protect,
  laboratoryOnly,
  acceptBooking
);


// ======================================================
// REJECT BOOKING
// ======================================================

router.put(
  "/reject/:id",
  protect,
  laboratoryOnly,
  rejectBooking
);


// ======================================================
// COMPLETE BOOKING
// ======================================================

router.put(
  "/complete/:id",
  protect,
  laboratoryOnly,
  completeBooking
);
router.put(
  "/rider-accept/:id",
  riderAcceptBooking
);

router.put(
  "/rider-reject/:id",
  riderRejectBooking
);

module.exports = router;