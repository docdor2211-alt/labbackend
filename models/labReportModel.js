// const mongoose =
//   require("mongoose");

// const labReportSchema =
//   new mongoose.Schema(

//     {

//       // ================= USER =================

//       userId: {

//         type:
//           mongoose.Schema.Types.ObjectId,

//         ref: "User",

//         required: true,

//       },


//       // ================= DOCTOR =================

//       doctorId: {

//         type:
//           mongoose.Schema.Types.ObjectId,

//         ref: "Doctor",

//         required: true,

//       },


//       // ================= LAB =================

//       laboratoryId: {

//         type:
//           mongoose.Schema.Types.ObjectId,

//         ref: "LaboratoryUser",

//         required: true,

//       },


//       // ================= REPORT =================

//       patient: {

//         type: String,

//         required: true,

//       },

//       test: {

//         type: String,

//         required: true,

//       },

//       doctor: {

//         type: String,

//         default: "",

//       },

//       status: {

//         type: String,

//         enum: [

//           "Pending",

//           "Completed",

//           "Delivered",

//         ],

//         default: "Pending",

//       },

//       age: {

//         type: String,

//         default: "",

//       },

//       gender: {

//         type: String,

//         default: "",

//       },

//       reportId: {

//         type: String,

//         default: "",

//       },

//       sampleId: {

//         type: String,

//         default: "",

//       },

//       testValues: {

//         type: String,

//         default: "",

//       },

//       referenceRange: {

//         type: String,

//         default: "",

//       },

//       remarks: {

//         type: String,

//         default: "",

//       },

//       testDate: {

//         type: String,

//         default: "",

//       },

//       attachments: {

//         type: [String],

//         default: [],

//       },

//     },

//     {

//       timestamps: true,

//     }

//   );

// module.exports =
//   mongoose.model(
//     "LabReport",
//     labReportSchema
//   );




// models/labReportModel.js

const mongoose =
  require("mongoose");



// ======================================================
// LAB REPORT SCHEMA
// ======================================================

const labReportSchema =
  new mongoose.Schema(

    {

      // ================= USER PHONE =================

      userPhone: {

        type: String,

        required: true,

        trim: true,

      },



      // ================= LABORATORY =================

      laboratoryId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "LaboratoryUser",

        required: true,

      },



      // ================= PATIENT =================

      patient: {

        type: String,

        required: true,

        trim: true,

      },



      // ================= TEST =================

      test: {

        type: String,

        required: true,

        trim: true,

      },



      // ================= DOCTOR NAME =================

      doctor: {

        type: String,

        default: "",

      },



      // ================= STATUS =================

      status: {

        type: String,

        enum: [

          "Pending",

          "Completed",

          "Delivered",

        ],

        default: "Pending",

      },



      // ================= AGE =================

      age: {

        type: String,

        default: "",

      },



      // ================= GENDER =================

      gender: {

        type: String,

        default: "",

      },



      // ================= REPORT ID =================

      reportId: {

        type: String,

        default: "",

      },



      // ================= SAMPLE ID =================

      sampleId: {

        type: String,

        default: "",

      },



      // ================= TEST VALUES =================

      testValues: {

        type: String,

        default: "",

      },



      // ================= REFERENCE RANGE =================

      referenceRange: {

        type: String,

        default: "",

      },



      // ================= REMARKS =================

      remarks: {

        type: String,

        default: "",

      },



      // ================= TEST DATE =================

      testDate: {

        type: String,

        default: "",

      },



      // ================= ATTACHMENTS =================

      attachments: {

        type: [String],

        default: [],

      },

    },

    {

      timestamps: true,

    }

  );



module.exports =
  mongoose.model(

    "LabReport",

    labReportSchema

  );