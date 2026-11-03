const express = require("express");
const router = express.Router();
const { protect, pharmacyOnly } = require("../middleware/authMiddleware");
const {
  createPurchase,
  getPurchases,
  getAnalytics,
} = require("../controllers/pharmacyInventoryController");

router.use(protect, pharmacyOnly);
router.get("/analytics", getAnalytics);
router.get("/purchases", getPurchases);
router.post("/purchases", createPurchase);

module.exports = router;
