const express = require("express");

const router = express.Router();

const {

  createSchedule,

  getAllSchedules,

  getSingleSchedule,

  updateSchedule,

  deleteSchedule,

} = require(
  "../controllers/scheduleController"
);

const {

  protect,

  laboratoryOnly,

} = require(
  "../middleware/authMiddleware"
);


// ======================================================
// CREATE SCHEDULE
// ======================================================

router.post(
  "/create",
  protect,
  laboratoryOnly,
  createSchedule
);


// ======================================================
// GET ALL SCHEDULES
// ======================================================

router.get(
  "/all",
  protect,
  laboratoryOnly,
  getAllSchedules
);


// ======================================================
// GET SINGLE SCHEDULE
// ======================================================

router.get(
  "/:id",
  protect,
  laboratoryOnly,
  getSingleSchedule
);


// ======================================================
// UPDATE SCHEDULE
// ======================================================

router.put(
  "/update/:id",
  protect,
  laboratoryOnly,
  updateSchedule
);


// ======================================================
// DELETE SCHEDULE
// ======================================================

router.delete(
  "/delete/:id",
  protect,
  laboratoryOnly,
  deleteSchedule
);


module.exports = router;