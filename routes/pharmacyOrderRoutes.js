
const express = require("express");

const router = express.Router();

const {

  createOrder,

  getAllOrders,

  getAllPharmacyOrders,

  getSingleOrder,

  updateOrderStatus,

  markOrderAsDelivery,

  markOrderAsDelivered,

  updateOrder,

  deleteOrder,
   riderAcceptOrder,
  riderRejectOrder,

} = require(
  "../controllers/pharmacyOrderController"
);

const {

  protect,

  pharmacyOnly,

} = require(
  "../middleware/authMiddleware"
);


// ======================================================
// CREATE ORDER
// ======================================================

router.post(
  "/create",
  protect,
  pharmacyOnly,
  createOrder
);


// ======================================================
// GET LOGIN PHARMACY ORDERS
// ======================================================

router.get(
  "/all",
  protect,
  pharmacyOnly,
  getAllOrders
);


// ======================================================
// GET ALL PHARMACY ORDERS
// ======================================================

router.get(
  "/all-orders",
  getAllPharmacyOrders
);


// ======================================================
// GET SINGLE ORDER
// ======================================================

router.get(
  "/:id",
  protect,
  pharmacyOnly,
  getSingleOrder
);


// ======================================================
// ACCEPT / CANCEL ORDER
// ======================================================

router.put(
  "/update-status/:id",
  protect,
  pharmacyOnly,
  updateOrderStatus
);


// ======================================================
// OUT FOR DELIVERY
// ======================================================

router.put(
  "/delivery/:id",
  protect,
  pharmacyOnly,
  markOrderAsDelivery
);


// ======================================================
// MARK AS DELIVERED
// ======================================================

router.put(
  "/delivered/:id",
  protect,
  pharmacyOnly,
  markOrderAsDelivered
);


// ======================================================
// UPDATE FULL ORDER
// ======================================================

router.put(
  "/update/:id",
  protect,
  pharmacyOnly,
  updateOrder
);


// ======================================================
// DELETE ORDER
// ======================================================

router.delete(
  "/delete/:id",
  protect,
  pharmacyOnly,
  deleteOrder
);

// Rider Accept Order
router.put(
  "/rider-accept/:id",
  riderAcceptOrder
);

// Rider Reject Order
router.put(
  "/rider-reject/:id",
  riderRejectOrder
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;