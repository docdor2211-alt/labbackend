const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");



const receptionSchema =
  new mongoose.Schema(

    {

      // FULL NAME
      fullname: {

        type: String,

        required: true,

      },



      // EMAIL
      email: {

        type: String,

        required: true,

        unique: true,

      },



      // PHONE
      phone: {

        type: String,

        required: true,

      },



      // PASSWORD
      password: {

        type: String,

        required: true,

        select: false,

      },



      // ROLE
      role: {

        type: String,

        default: "reception",

      },



      // DOCTOR ID
      doctorId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        required: true,

      },



      // ACTIVE
      isActive: {

        type: Boolean,

        default: true,

      },

    },

    {

      timestamps: true,

    }

  );



// ==========================================
// HASH PASSWORD
// ==========================================

receptionSchema.pre(

  "save",

  async function () {

    if (

      !this.isModified(
        "password"
      )

    )

      return;



    this.password =
      await bcrypt.hash(

        this.password,

        10

      );

  }

);



// ==========================================
// MATCH PASSWORD
// ==========================================

receptionSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {

    return await bcrypt.compare(

      enteredPassword,

      this.password

    );

  };



module.exports =
  mongoose.model(

    "Reception",

    receptionSchema

  );