const mongoose =
  require("mongoose");

const petOrderItemSchema =
  new mongoose.Schema(

    {

      product: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "PetProduct",

        required: true,

      },

      name: String,

      image: String,

      quantity: Number,

      price: Number,

      totalPrice: Number,

      weight: String,

      flavor: String,

    },

    {

      _id: false,

    }

  );

const petOrderSchema =
  new mongoose.Schema(

    {

      // USER
      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },



      // PHARMACY
      pharmacyId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "PharmacyUser",

        required: true,

      },



      petName: String,

      petType: String,



      items: [
        petOrderItemSchema
      ],



      totalAmount:
        Number,



      paymentMethod:
        String,



      paymentStatus: {

        type: String,

        default: "PENDING",

      },



      deliveryAddress:
        String,



      orderStatus: {

        type: String,

        default: "PENDING",

      },



      razorpayOrderId:
        String,

      razorpayPaymentId:
        String,

      razorpaySignature:
        String,



      isCompleted: {

        type: Boolean,

        default: false,

      },

    },

    {

      timestamps: true,

    }

  );

module.exports =
  mongoose.model(

    "PetOrder",

    petOrderSchema

  );