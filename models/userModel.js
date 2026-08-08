const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(

    {

      fullname: String,

      email: String,

      phone: String,

      role: String,

    },

    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "User",
  userSchema
);