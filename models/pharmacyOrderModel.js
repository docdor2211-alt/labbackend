


// models/pharmacyOrderModel.js

const mongoose = require("mongoose");


// ======================================================
// ORDER ITEM SCHEMA
// ======================================================

const orderItemSchema =
  new mongoose.Schema({

    name: {

      type: String,

      required: true,

      trim: true,

    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PharmacyProduct",
      default: null,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    productModel: {
      type: String,
      enum: ["PharmacyProduct", "MedicineItem"],
      default: "PharmacyProduct",
    },

    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PharmacyUser",
      default: null,
    },

    inventoryAllocations: [
      {
        purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "PharmacyPurchase" },
        purchaseItemId: { type: mongoose.Schema.Types.ObjectId },
        quantity: { type: Number, min: 1 },
      },
    ],

    qty: {

      type: Number,

      required: true,

      min: 1,

    },

    quantity: {

      type: Number,

      min: 1,

    },

    price: {

      type: Number,

      required: true,

      min: 0,

    },

  });


// ======================================================
// PHARMACY ORDER SCHEMA
// ======================================================

const pharmacyOrderSchema =
  new mongoose.Schema(

    {

      // ==========================================
      // LOGIN PHARMACY
      // ==========================================

      pharmacy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "PharmacyUser",

        required: true,

      },


      // ==========================================
      // PATIENT NAME
      // ==========================================

      patient: {

        type: String,

        required: true,

        trim: true,

      },


      // ==========================================
      // ORDER DATE
      // ==========================================

      date: {

        type: String,

        required: true,

      },


      // ==========================================
      // ORDER ITEMS
      // ==========================================

      items: {

        type: [orderItemSchema],

        default: [],

      },

      inventoryAdjusted: {
        type: Boolean,
        default: false,
      },


      // ==========================================
      // ORDER STATUS
      // ==========================================

      status: {

        type: String,

        enum: [

          "Pending",

          "Accepted",

          "Packed",

          "Out For Delivery",

          "Delivered",

          "Cancelled",

        ],

        default: "Pending",

      },


      // ==========================================
      // DELIVERY ADDRESS
      // ==========================================

      address: {

        type: String,

        required: true,

        trim: true,

      },


      // ==========================================
      // TOTAL AMOUNT
      // ==========================================

      total: {

        type: Number,

        default: 0,

        min: 0,

      },

      totalAmount: {
        type: Number,
        min: 0,
      },

      deliveryAddress: {
        type: String,
        default: "",
        trim: true,
      },

      orderStatus: {
        type: String,
        default: "PLACED",
      },

      pharmacyStatus: {
        type: String,
        default: "Pending",
      },

      deliveryStatus: {
        type: String,
        default: "Pending",
      },

      cancelledAt: {
        type: Date,
      },

    },

    {

      timestamps: true,

    }

  );


// ======================================================
// EXPORT MODEL
// ======================================================

module.exports =
  mongoose.models.MedicineOrder ||
  mongoose.model(
    "MedicineOrder",
    pharmacyOrderSchema
  );