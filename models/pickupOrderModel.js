const mongoose = require("mongoose");



const pickupItemSchema =
  new mongoose.Schema({

    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    prescriptionId: {
      type: String,
      default: "",
    },

  });



const pickupOrderSchema =
  new mongoose.Schema(

    {

      // PHARMACY
      pharmacy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "PharmacyUser",

        required: true,

      },

      orderId: {

        type: String,

        required: true,

      },

      customerName: {

        type: String,

        required: true,

      },

      customerPhone: {

        type: String,

        required: true,

      },

      pickupTime: {

        type: String,

        required: true,

      },

      status: {

        type: String,

        enum: [

          "pending",

          "ready",

          "completed",

          "cancelled",

          "delivery",

        ],

        default: "pending",

      },

      items: [pickupItemSchema],

      totalAmount: {

        type: Number,

        default: 0,

      },

      address: {

        type: String,

        default: "",

      },

    },

    {
      timestamps: true,
    }

  );

module.exports = mongoose.model(
  "PickupOrder",
  pickupOrderSchema
);