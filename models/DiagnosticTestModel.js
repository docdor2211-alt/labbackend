const mongoose =
  require("mongoose");

const diagnosticTestSchema =
  new mongoose.Schema(

    {

      // TEST NAME
      name: {

        type: String,

        required: true,

        trim: true,

      },



      // TEST PRICE
      price: {

        type: Number,

        required: true,

      },



      // CATEGORY
      category: {

        type: String,

        required: true,

        trim: true,

      },



      // DESCRIPTION
      description: {

        type: String,

        required: true,

        trim: true,

      },



      // IMAGE URL
      image_url: {

        type: String,

        default: "",

      },

    },

    {

      timestamps: true,

    }

  );



module.exports =
  mongoose.model(
    "DiagnosticTest",
    diagnosticTestSchema
  );