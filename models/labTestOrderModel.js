// models/labTestOrderModel.js

const mongoose = require("mongoose");

const labTestOrderSchema =
  new mongoose.Schema(

    {

      // ==================================================
      // USER
      // ==================================================

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },


      // ==================================================
      // TEST DETAILS
      // ==================================================

      testName: {

        type: String,

        required: true,

        trim: true,

      },

      price: {

        type: Number,

        required: true,

      },


      // ==================================================
      // BOOKING STATUS
      // ==================================================

      status: {

        type: String,

        enum: [

          "Pending",

          "Confirmed",

          "Cancelled",

          "Sample Collected",

          "Processing",

          "Completed",

        ],

        default: "Pending",

      },


      // ==================================================
      // SAMPLE COLLECTION
      // ==================================================

      sampleCollectionType: {

        type: String,

        enum: [

          "Home",

          "Lab Visit",

        ],

        default: "Home",

      },


      // ==================================================
      // SCHEDULE DATE
      // ==================================================

      scheduledDate: {

        type: Date,

        required: true,

      },


      // ==================================================
      // REPORT
      // ==================================================

      reportUrl: {

        type: String,

        default: "",

      },


      // ==================================================
      // PAYMENT
      // ==================================================

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


      // ==================================================
      // RAZORPAY
      // ==================================================

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


      // ==================================================
      // COMPLETION
      // ==================================================

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
  "LabTestOrder",
  labTestOrderSchema
);










// // models/LabTestModel.js

// const mongoose =
//   require("mongoose");



// // ================= PARAMETERS =================

// const parameterSchema =
//   new mongoose.Schema({

//     title: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//   });



// // ================= GUIDELINES =================

// const guidelineSchema =
//   new mongoose.Schema({

//     text: {
//       type: String,
//       required: true,
//     },

//   });



// // ================= MAIN MODEL =================

// const labTestSchema =
//   new mongoose.Schema(

//     {

//       // TITLE
//       title: {
//         type: String,
//         required: true,
//       },



//       // SHORT DESCRIPTION
//       shortDescription: {
//         type: String,
//         default: "",
//       },



//       // FULL DESCRIPTION
//       description: {
//         type: String,
//         default: "",
//       },



//       // CATEGORY
//       category: {

//         type:
//           mongoose.Schema.Types.ObjectId,

//         ref: "LabCategory",

//         required: true,
//       },



//       // CHECKUP TYPE
//       checkupType: {

//         type:
//           mongoose.Schema.Types.ObjectId,

//         ref: "CheckupType",

//         required: true,
//       },



//       // IMAGE
//       image: {

//         url: {
//           type: String,
//           default: "",
//         },

//         publicId: {
//           type: String,
//           default: "",
//         },

//       },



//       // PRICE
//       actualPrice: {
//         type: Number,
//         required: true,
//       },

//       salePrice: {
//         type: Number,
//         required: true,
//       },



//       // REPORT TIME
//       reportTime: {
//         type: String,
//         default: "24-48 Hours",
//       },



//       // TOTAL TESTS
//       totalTests: {
//         type: Number,
//         default: 0,
//       },



//       // RECOMMENDED
//       recommended: {
//         type: Boolean,
//         default: false,
//       },



//       // BEST SELLER
//       bestSeller: {
//         type: Boolean,
//         default: false,
//       },



//       // FEATURES
//       homeSample: {
//         type: Boolean,
//         default: true,
//       },

//       digitalReport: {
//         type: Boolean,
//         default: true,
//       },

//       nablCertified: {
//         type: Boolean,
//         default: true,
//       },



//       // GUIDELINES
//       guidelines:
//         [guidelineSchema],



//       // PARAMETERS
//       parameters:
//         [parameterSchema],

//     },

//     {
//       timestamps: true,
//     }

//   );



// module.exports =
//   mongoose.model(
//     "LabTest",
//     labTestSchema
//   );