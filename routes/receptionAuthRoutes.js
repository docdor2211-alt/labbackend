const express =
  require("express");

const router =
  express.Router();

const {

  registerReception,

  loginReception,

} = require(
  "../controllers/receptionAuthController"
);


// REGISTER
router.post(
  "/register",
  registerReception
);


// LOGIN
router.post(
  "/login",
  loginReception
);

module.exports =
  router;