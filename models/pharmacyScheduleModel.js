const mongoose = require("mongoose");



const pharmacyScheduleSchema =
  new mongoose.Schema(

    {

     
      pharmacy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "PharmacyUser",

        required: true,

      },


    

      day: {

        type: String,

        required: true,

      },


    

      isOpen: {

        type: Boolean,

        default: true,

      },



      openingTime: {

        type: String,

        default: "",

      },


   

      closingTime: {

        type: String,

        default: "",

      },



      isHoliday: {

        type: Boolean,

        default: false,

      },



      holidayTitle: {

        type: String,

        default: "",

      },



      holidayDate: {

        type: Date,

      },

    },

    {

      timestamps: true,

    }

  );




module.exports = mongoose.model(

  "PharmacySchedule",

  pharmacyScheduleSchema

);