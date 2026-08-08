const express = require("express");

const router = express.Router();

const {

  createPickupOrder,

  getAllPickupOrders,

  getAllPharmacyPickupOrders,

  updatePickupOrderStatus,

  markAsDelivery,

  deletePickupOrder,

} = require(
  "../controllers/pickupOrderController"
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
  createPickupOrder
);


// LOGIN PHARMACY ORDERS
router.get(
  "/all",
  protect,
  pharmacyOnly,
  getAllPickupOrders
);


// ALL PHARMACY ORDERS
router.get(
  "/all-orders",
  getAllPharmacyPickupOrders
);


// UPDATE STATUS
router.put(
  "/update-status/:id",
  protect,
  pharmacyOnly,
  updatePickupOrderStatus
);


// DELIVERY API
router.put(
  "/delivery/:id",
  protect,
  pharmacyOnly,
  markAsDelivery
);


// DELETE
router.delete(
  "/delete/:id",
  protect,
  pharmacyOnly,
  deletePickupOrder
);

module.exports = router;