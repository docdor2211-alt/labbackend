

// module.exports =
//   router;

const express = require("express");
const router = express.Router();

const {
getMyPharmacyOrders,
getSinglePharmacyOrder,
getAllPetOrdersForRider,
riderRejectPetOrder,
riderAcceptPetOrder,
} = require(
"../controllers/managementPetOrderController"
);

const {
protect,
pharmacyOnly,
} = require(
"../middleware/authMiddleware"
);

// Pharmacy Login Orders
router.get(
"/all",
protect,
pharmacyOnly,
getMyPharmacyOrders
);

// Rider Orders API
router.get(
"/all-orders",
getAllPetOrdersForRider
);

// Single Order
router.get(
"/:id",
protect,
pharmacyOnly,
getSinglePharmacyOrder
);

router.put(
  "/rider-accept/:id",
  riderAcceptPetOrder
);

router.put(
  "/rider-reject/:id",
  riderRejectPetOrder
);

module.exports = router;
