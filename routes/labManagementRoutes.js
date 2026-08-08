// routes/labManagementRoutes.js

const express = require("express");

const router = express.Router();

const {

  getAllPatients,

  getSinglePatient,

  updateBookingStatus,

  uploadReport,

} = require(
  "../controllers/labManagementController"
);

const {

  protect,

  laboratoryOnly,

} = require(
  "../middleware/authMiddleware"
);


// ======================================================
// GET ALL LAB BOOKINGS / PATIENTS
// ======================================================

router.get(
  "/patients",
  protect,
  laboratoryOnly,
  getAllPatients
);


// ======================================================
// GET SINGLE PATIENT BOOKING
// ======================================================

router.get(
  "/patients/:id",
  protect,
  laboratoryOnly,
  getSinglePatient
);


// ======================================================
// UPDATE BOOKING STATUS
// ======================================================

router.put(
  "/patients/status/:id",
  protect,
  laboratoryOnly,
  updateBookingStatus
);


// ======================================================
// UPLOAD REPORT
// ======================================================

router.put(
  "/patients/report/:id",
  protect,
  laboratoryOnly,
  uploadReport
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;