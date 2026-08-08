// models/labBookingModel.js

const mongoose = require("mongoose");

const labBookingSchema =
  new mongoose.Schema(
    {
     

      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

   

      testName: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

   

      status: {
        type: String,

        enum: [
          "Pending",
          "Confirmed",
          "Processing",
          "Completed",
          "Cancelled",
        ],

        default: "Pending",
      },

    

      sampleCollectionType: {
        type: String,

        enum: [
          "Home",
          "Lab Visit",
        ],

        default: "Home",
      },

    

      scheduledDate: {
        type: Date,
      },

    

      reportUrl: {
        type: String,
        default: "",
      },

     

      paymentMethod: {
        type: String,

        enum: [
          "COD",
          "ONLINE",
        ],

        default: "ONLINE",
      },

      paymentStatus: {
        type: String,

        enum: [
          "PENDING",
          "PAID",
          "FAILED",
        ],

        default: "PENDING",
      },


      razorpayOrderId: {
        type: String,
        default: "",
      },

      razorpayPaymentId: {
        type: String,
        default: "",
      },

      razorpaySignature: {
        type: String,
        default: "",
      },

 

      isCompleted: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "LabBooking",
  labBookingSchema
);