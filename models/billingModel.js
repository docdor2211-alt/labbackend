const mongoose =
  require("mongoose");


const billingSchema =
  new mongoose.Schema(

    {

      // =========================
      // APPOINTMENT
      // =========================

      appointmentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Appointment",

        required: true,

      },


      // =========================
      // RECEPTION
      // =========================

      receptionId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Reception",

        required: true,

      },


      // =========================
      // PATIENT DETAILS
      // =========================

      patientName: {

        type: String,

        required: true,

      },

      patientPhone: {

        type: String,

        required: true,

      },
tests: [
  {
    testName: {
      type: String,
      required: true,
      trim: true
    },

    testPrice: {
      type: Number,
      default: 0
    }
  }
],

      // =========================
      // BILLING
      // =========================

      consultationFee: {

        type: Number,

        required: true,

      },

      registrationFee: {

        type: Number,

        default: 0,

      },

      otherCharges: {

        type: Number,

        default: 0,

      },


      discount: {

        type: Number,

        default: 0,

      },


      totalAmount: {

        type: Number,

        required: true,

      },


      // =========================
      // PAYMENT STATUS
      // =========================

    paymentStatus: {

  type: String,

  enum: [

    "Pending",

    "Paid",

  ],

  default: "Paid",

},

    },

    {
      timestamps: true,
    }

  );

module.exports =
  mongoose.model(
    "Billing",
    billingSchema
  );