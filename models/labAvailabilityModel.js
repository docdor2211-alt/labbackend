// models/labAvailabilityModel.js

const mongoose = require("mongoose");




const labAvailabilitySchema =
  new mongoose.Schema(

    {

 

      laboratoryId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "LaboratoryUser",

        required: true,

        unique: true,

      },


  

      is_online: {

        type: Boolean,

        default: false,

      },

    },

    {

      timestamps: true,

    }

  );




const LabAvailability =
  mongoose.models.LabAvailability ||

  mongoose.model(
    "LabAvailability",
    labAvailabilitySchema
  );

module.exports = LabAvailability;