const mongoose = require("mongoose");

const pharmacyProductSchema = new mongoose.Schema(
  {
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PharmacyUser",
      required: true,
      index: true,
    },
    productTitle: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    mrp: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10, min: 0 },
    gst: { type: String, default: "" },
    expiryDate: { type: String, default: "" },
    prescriptionRequired: { type: Boolean, default: false },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PharmacyProduct", pharmacyProductSchema);
