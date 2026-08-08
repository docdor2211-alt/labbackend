// routes/pharmacyProductRoutes.js

const express = require("express");

const router = express.Router();

const {

  createProduct,

  getAllProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,

} = require(
  "../controllers/pharmacyProductController"
);

const {

  protect,

  pharmacyOnly,

} = require(
  "../middleware/authMiddleware"
);


// ======================================================
// CREATE PRODUCT
// ======================================================

router.post(
  "/create",
  protect,
  pharmacyOnly,
  createProduct
);


// ======================================================
// GET MY PRODUCTS
// ======================================================

router.get(
  "/all",
  protect,
  pharmacyOnly,
  getAllProducts
);


// ======================================================
// GET SINGLE PRODUCT
// ======================================================

router.get(
  "/:id",
  protect,
  pharmacyOnly,
  getSingleProduct
);


// ======================================================
// UPDATE PRODUCT
// ======================================================

router.put(
  "/update/:id",
  protect,
  pharmacyOnly,
  updateProduct
);


// ======================================================
// DELETE PRODUCT
// ======================================================

router.delete(
  "/delete/:id",
  protect,
  pharmacyOnly,
  deleteProduct
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;