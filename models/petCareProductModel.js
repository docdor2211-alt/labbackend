

// // ======================================================
// // models/petCareProductModel.js
// // ======================================================

// const mongoose =
//   require("mongoose");

// // ======================================================
// // PET CATEGORY SCHEMA
// // ======================================================

// const petCategorySchema =
//   new mongoose.Schema({

//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     image: {
//       url: {
//         type: String,
//         default: "",
//       },
//     },

//   });

// // ======================================================
// // PET CARE PRODUCT SCHEMA
// // ======================================================

// const petCareProductSchema =
//   new mongoose.Schema(

//     {

//       // ================= TITLE =================

//       title: {

//         type: String,

//         required: true,

//         trim: true,

//       },

//       // ================= SHORT DESCRIPTION =================

//       shortDescription: {

//         type: String,

//         default: "",

//       },

//       // ================= FULL DESCRIPTION =================

//       description: {

//         type: String,

//         default: "",

//       },

//       // ================= PET CATEGORY =================

//       petCategory: {

//         type: petCategorySchema,

//         required: false,

//       },

//       // ================= NEED TYPE =================

//       needType: {

//         type: String,

//         enum: [

//           "food",

//           "medicines",

//           "toys",

//           "accessories",

//           "other",

//         ],

//         default: "other",

//       },

//       // ================= PRICE =================

//       price: {

//         type: Number,

//         required: true,

//         default: 0,

//       },

//       // ================= WEIGHT =================

//       weight: {

//         type: String,

//         default: "",

//       },

//       // ================= FLAVOR =================

//       flavor: {

//         type: String,

//         default: "",

//       },

//       // ================= AGE TYPE =================

//       ageType: {

//         type: String,

//         enum: [

//           "baby",

//           "adult",

//           "senior",

//           "all",

//         ],

//         default: "all",

//       },

//       // ================= RATING =================

//       rating: {

//         type: Number,

//         default: 0,

//       },

//       // ================= STOCK =================

//       stock: {

//         type: Number,

//         default: 0,

//       },

//       // ================= IMAGE =================

//       image: {

//         url: {

//           type: String,

//           default: "",

//         },

//       },

//       // ================= AVAILABILITY =================

//       isAvailable: {

//         type: Boolean,

//         default: true,

//       },

//     },

//     {

//       timestamps: true,

//     }

//   );

// module.exports =
//   mongoose.model(

//     "PetCareProduct",

//     petCareProductSchema

//   );



const mongoose =
  require("mongoose");



// ======================================================
// PET CATEGORY SCHEMA
// ======================================================

const petCategorySchema =
  new mongoose.Schema({

    title: {

      type: String,

      required: true,

      trim: true,

    },



    image: {

      url: {

        type: String,

        default: "",

      },

    },

  });



// ======================================================
// PET CARE PRODUCT SCHEMA
// ======================================================

const petCareProductSchema =
  new mongoose.Schema(

    {

      // ================= PHARMACY =================

      pharmacyId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "PharmacyUser",

        required: true,

      },



      // ================= TITLE =================

      title: {

        type: String,

        required: true,

        trim: true,

      },



      // ================= SHORT DESCRIPTION =================

      shortDescription: {

        type: String,

        default: "",

      },



      // ================= DESCRIPTION =================

      description: {

        type: String,

        default: "",

      },



      // ================= PET CATEGORY =================

      petCategory: {

        type:
          petCategorySchema,

      },



      // ================= NEED TYPE =================

      needType: {

        type: String,

        enum: [

          "food",

          "medicines",

          "toys",

          "accessories",

          "other",

        ],

        default: "other",

      },



      // ================= PRICE =================

      price: {

        type: Number,

        required: true,

        default: 0,

      },



      // ================= WEIGHT =================

      weight: {

        type: String,

        default: "",

      },



      // ================= FLAVOR =================

      flavor: {

        type: String,

        default: "",

      },



      // ================= AGE TYPE =================

      ageType: {

        type: String,

        enum: [

          "baby",

          "adult",

          "senior",

          "all",

        ],

        default: "all",

      },



      // ================= RATING =================

      rating: {

        type: Number,

        default: 0,

      },



      // ================= STOCK =================

      stock: {

        type: Number,

        default: 0,

      },



      // ================= IMAGE =================

      image: {

        url: {

          type: String,

          default: "",

        },

      },



      // ================= STATUS =================

      isAvailable: {

        type: Boolean,

        default: true,

      },

    },

    {

      timestamps: true,

    }

  );



module.exports =
  mongoose.model(

    "PetCareProduct",

    petCareProductSchema

  );