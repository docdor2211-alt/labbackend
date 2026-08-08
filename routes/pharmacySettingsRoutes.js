const express = require("express");

const router = express.Router();

const {

  saveSettings,

  getSettings,

} = require(
  "../controllers/pharmacySettingsController"
);

const {

  protect,

  pharmacyOnly,

} = require(
  "../middleware/authMiddleware"
);


// SAVE SETTINGS
router.post(
  "/save",
  protect,
  pharmacyOnly,
  saveSettings
);


// GET SETTINGS
router.get(
  "/get",
  protect,
  pharmacyOnly,
  getSettings
);

module.exports = router;