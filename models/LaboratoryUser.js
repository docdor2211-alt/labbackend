const mongoose = require("mongoose");




const licenseSchema =
  new mongoose.Schema({

    title: String,

    expiry: String,

    status: String,

  });




const laboratoryUserSchema =
  new mongoose.Schema(

    {

      // BASIC
      fullName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      phone: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
      },


      // PROFILE
      doctorName: {
        type: String,
        default: "",
      },

      labName: {
        type: String,
        default: "",
      },

      labId: {
        type: String,
        default: "",
      },

      profileImage: {
        type: String,
        default: "",
      },


      // LAB DETAILS
      labPhone: {
        type: String,
        default: "",
      },

      labAddress: {
        type: String,
        default: "",
      },

      labWebsite: {
        type: String,
        default: "",
      },

      registrationNo: {
        type: String,
        default: "",
      },

      labType: {
        type: String,
        default: "",
      },

      gstNo: {
        type: String,
        default: "",
      },

      workingHours: {
        type: String,
        default: "",
      },

      homeSample: {
        type: String,
        default: "",
      },

      emergency: {
        type: String,
        default: "",
      },

      bannerImage: {
        type: String,
        default: "",
      },


      
      licenses: [licenseSchema],

    },

    {
      timestamps: true,
    }

  );

module.exports = mongoose.model(
  "LaboratoryUser",
  laboratoryUserSchema
);