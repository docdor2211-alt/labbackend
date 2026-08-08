const express = require("express");

const router = express.Router();

const {
  createDiagnosticTest,
  getAllDiagnosticTests,
  getSingleDiagnosticTest,
  updateDiagnosticTest,
  deleteDiagnosticTest,
} = require(
  "../controllers/diagnosticTestController"
);

// CREATE
router.post(
  "/create",
  createDiagnosticTest
);

// GET ALL
router.get(
  "/all",
  getAllDiagnosticTests
);

// GET SINGLE
router.get(
  "/:id",
  getSingleDiagnosticTest
);

// UPDATE
router.put(
  "/update/:id",
  updateDiagnosticTest
);

// DELETE
router.delete(
  "/delete/:id",
  deleteDiagnosticTest
);

module.exports = router;