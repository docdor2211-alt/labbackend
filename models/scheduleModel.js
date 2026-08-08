const mongoose = require("mongoose");

const scheduleSchema =
  new mongoose.Schema(

    {

  

      day: {

        type: String,

        required: true,

        enum: [ 

          "Monday",

          "Tuesday",

          "Wednesday",

          "Thursday",

          "Friday",

          "Saturday",

          "Sunday",

        ],

      },



      isOpen: {

        type: Boolean,

        default: true,

      },



      openingTime: {

        type: String,

        default: "09:00 AM",

      },


     

      closingTime: {

        type: String,

        default: "06:00 PM",

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
  "Schedule",
  scheduleSchema
);