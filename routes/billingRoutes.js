const express =
  require("express");

const router =
  express.Router();

const {

  createBill,

  getAllBills,

} = require(
  "../controllers/billingController"
);

const {

  protect,

  receptionOnly,

} = require(
  "../middleware/authMiddleware"
);


// =====================================
// CREATE BILL
// =====================================

router.post(

  "/create",

  protect,

  receptionOnly,

  createBill

);


// =====================================
// GET ALL BILLS
// =====================================

router.get(

  "/all",

  protect,

  receptionOnly,

  getAllBills

);


module.exports =
  router;