const express = require("express");

const router = express.Router();

const {

  createSchedule,

  getSchedules,

  updateSchedule,

  deleteSchedule,

} = require(
  "../controllers/pharmacyScheduleController"
);

const {

  protect,

  pharmacyOnly,

} = require(
  "../middleware/authMiddleware"
);


// CREATE
router.post(
  "/create",
  protect,
  pharmacyOnly,
  createSchedule
);


// GET
router.get(
  "/all",
  protect,
  pharmacyOnly,
  getSchedules
);


// UPDATE
router.put(
  "/update/:id",
  protect,
  pharmacyOnly,
  updateSchedule
);


// DELETE
router.delete(
  "/delete/:id",
  protect,
  pharmacyOnly,
  deleteSchedule
);

module.exports = router;