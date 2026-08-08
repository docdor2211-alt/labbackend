// routes/pharmacyAuthRoutes.js

const express = require("express");

const router = express.Router();

const {

  registerPharmacy,

  loginPharmacy,

  getAllPharmacies,

  getPharmacyProfile,

} = require(
  "../controllers/pharmacyAuthController"
);


// REGISTER
router.post(
  "/register",
  registerPharmacy
);


// LOGIN
router.post(
  "/login",
  loginPharmacy
);


// GET ALL
router.get(
  "/all",
  getAllPharmacies
);


// GET PROFILE
router.get(
  "/profile/:id",
  getPharmacyProfile
);


module.exports = router;