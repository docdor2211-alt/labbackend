const mongoose = require("mongoose");


// ======================================================
// PHARMACY SETTINGS SCHEMA
// ======================================================

const pharmacySettingsSchema =
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

        unique: true,

      },


      // ==========================================
      // ONLINE STATUS
      // ==========================================

      isOnline: {

        type: Boolean,

        default: true,

      },


      // ==========================================
      // OPENING TIME
      // ==========================================

      openingTime: {

        type: String,

        default: "09:00",

      },


      // ==========================================
      // CLOSING TIME
      // ==========================================

      closingTime: {

        type: String,

        default: "23:00",

      },

    },

    {

      timestamps: true,

    }

  );

module.exports = mongoose.model(

  "PharmacySettings",

  pharmacySettingsSchema

);