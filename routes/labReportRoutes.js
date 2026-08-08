const express = require("express");

const router = express.Router();

const {

  createLabReport,

  getAllLabReports,

  getSingleLabReport,

} = require(
  "../controllers/labReportController"
);


// ======================================================
// CREATE REPORT
// ======================================================

router.post(
  "/create",
  createLabReport
);


// ======================================================
// GET ALL REPORTS
// ======================================================

router.get(
  "/all",
  getAllLabReports
);


// ======================================================
// GET SINGLE REPORT
// ======================================================

router.get(
  "/:id",
  getSingleLabReport
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;