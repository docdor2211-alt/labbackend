const express = require("express");

const router = express.Router();

const {

  createLabPerformance,

  getLabPerformance,

} = require(
  "../controllers/labPerformanceController"
);


// ======================================================
// CREATE PERFORMANCE
// ======================================================

router.post(
  "/create",
  createLabPerformance
);


// ======================================================
// GET PERFORMANCE
// ======================================================

router.get(
  "/all",
  getLabPerformance
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;