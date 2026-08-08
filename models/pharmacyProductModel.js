// models/pharmacyProductModel.js

const mongoose = require("mongoose");




const pharmacyProductSchema =
  new mongoose.Schema(

    {

  
      pharmacy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "PharmacyUser",

        required: true,

      },


 

      productTitle: {

        type: String,

        required: true,

        trim: true,

      },


     

      brand: {

        type: String,

        required: true,

      },


    

      category: {

        type: String,

        required: true,

      },


    

      description: {

        type: String,

        default: "",

      },




      mrp: {

        type: Number,

        required: true,

      },


    

      discount: {

        type: Number,

        default: 0,

      },


   

      stock: {

        type: Number,

        default: 0,

      },




      gst: {

        type: String,

        default: "",

      },



      expiryDate: {

        type: String,

        default: "",

      },


    

      prescriptionRequired: {

        type: Boolean,

        default: false,

      },


  

      image: {

        type: String,

        default: "",

      },

    },

    {
      timestamps: true,
    }

  );



module.exports = mongoose.model(
  "MedicineItem",
  pharmacyProductSchema
);