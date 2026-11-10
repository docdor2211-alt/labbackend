// routes/pharmacyProductRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const {

  createProduct,

  getAllProducts,

  getSingleProduct,

  getPublicProducts,

  getPublicSingleProduct,

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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed"));
    }
    return callback(null, true);
  },
});

router.post(
  "/create",
  protect,
  pharmacyOnly,
  upload.single("image"),
  createProduct
);

router.get(
  "/public",
  getPublicProducts
);

router.get(
  "/public/:id",
  getPublicSingleProduct
);

router.get(
  "/all",
  protect,
  pharmacyOnly,
  getAllProducts
);

router.get(
  "/:id",
  protect,
  pharmacyOnly,
  getSingleProduct
);

router.put(
  "/update/:id",
  protect,
  pharmacyOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/delete/:id",
  protect,
  pharmacyOnly,
  deleteProduct
);

module.exports = router;