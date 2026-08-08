// models/appointmentModel.js

const mongoose =
  require("mongoose");

const appointmentSchema =
  new mongoose.Schema(

    {
        receptionId: {

  type:
    mongoose.Schema.Types.ObjectId,

  ref: "Reception",

  required: true,

},

      /* =========================
         DATE & TIME
      ========================= */

      date: {

        type: String,

        required: true,

      },

      time: {

        type: String,

        required: true,

      },

      /* =========================
         APPOINTMENT TYPE
      ========================= */

      type: {

        type: String,

        default: "Offline",

      },

      /* =========================
         PATIENT DETAILS
      ========================= */

      patientName: {

        type: String,

        required: true,

      },

      patientPhone: {

        type: String,

        required: true,

      },

      age: {

        type: Number,

        default: 0,

      },

      gender: {

        type: String,

        default: "",

      },

      /* =========================
         MEDICAL INFO
      ========================= */

      reason: {

        type: String,

        default: "",

      },

      bloodPressure: {

        type: String,

        default: "",

      },

      weight: {

        type: String,

        default: "",

      },

      temperature: {

        type: String,

        default: "",

      },

      /* =========================
         STATUS
      ========================= */

      status: {

        type: String,

        enum: [

          "Pending",

          "Confirmed",

          "Completed",

          "Cancelled",

        ],

        default: "Pending",

      },

    },

    {
      timestamps: true,
    }

  );

module.exports =
  mongoose.model(

    "Appointment",

    appointmentSchema

  );