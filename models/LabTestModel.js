// models/LabTestModel.js

const mongoose =
  require("mongoose");



// ================= PARAMETERS =================

const parameterSchema =
  new mongoose.Schema({

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

  });



// ================= GUIDELINES =================

const guidelineSchema =
  new mongoose.Schema({

    text: {
      type: String,
      required: true,
    },

  });



// ================= MAIN MODEL =================

const labTestSchema =
  new mongoose.Schema(

    {

      // TITLE
      title: {
        type: String,
        required: true,
      },



      // SHORT DESCRIPTION
      shortDescription: {
        type: String,
        default: "",
      },



      // FULL DESCRIPTION
      description: {
        type: String,
        default: "",
      },



      // CATEGORY (Supports both labCategory and category)
      labCategory: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "LabCategory",
      },

      category: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "LabCategory",
      },



      // CHECKUP TYPE
      checkupType: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "CheckupType",

        required: true,
      },



      // IMAGE
      image: {
        type: mongoose.Schema.Types.Mixed,
        default: () => ({ url: "", publicId: "" }),
      },



      // PRICE
      actualPrice: {
        type: Number,
        required: true,
      },

      salePrice: {
        type: Number,
        required: true,
      },



      // REPORT TIME
      reportTime: {
        type: String,
        default: "24-48 Hours",
      },



      // TOTAL TESTS
      totalTests: {
        type: Number,
        default: 0,
      },



      // RECOMMENDED
      recommended: {
        type: Boolean,
        default: false,
      },



      // BEST SELLER
      bestSeller: {
        type: Boolean,
        default: false,
      },



      // FEATURES
      homeSample: {
        type: Boolean,
        default: true,
      },

      digitalReport: {
        type: Boolean,
        default: true,
      },

      nablCertified: {
        type: Boolean,
        default: true,
      },



      // GUIDELINES
      guidelines:
        [guidelineSchema],



      // PARAMETERS
      parameters:
        [parameterSchema],

    },

    {
      timestamps: true,
    }

  );



module.exports =
  mongoose.model(
    "LabTest",
    labTestSchema
  );