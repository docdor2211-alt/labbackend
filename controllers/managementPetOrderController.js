const PetOrder =
  require(
    "../models/petOrderModel"
  );



// ======================================================
// GET MY PHARMACY ORDERS
// ======================================================

exports.getMyPharmacyOrders =
  async (req, res) => {

    try {

      const orders =
        await PetOrder.find({

          pharmacyId:
            req.user.id,

        })

          .populate(

            "user",

            "name email phone"

          )

          .sort({

            createdAt: -1,

          });



      res.status(200).json({

        success: true,

        count:
          orders.length,

        data:
          orders,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// GET SINGLE ORDER
// ======================================================

exports.getSinglePharmacyOrder =
  async (req, res) => {

    try {

      const order =
        await PetOrder.findOne({

          _id:
            req.params.id,

          pharmacyId:
            req.user.id,

        }).populate(

          "user",

          "name email phone"

        );



      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }



      res.status(200).json({

        success: true,

        data:
          order,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

  exports.getAllPetOrdersForRider =
async (req, res) => {
try {
const orders =
await PetOrder.find()
.populate(
"user",
"name email phone"
)
.sort({
createdAt: -1,
});

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
} catch (error) {
  console.log(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}


};

exports.riderAcceptPetOrder =
async (req, res) => {
  try {

    const order =
      await PetOrder.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus =
      "CONFIRMED";

    order.riderId =
      req.body.riderId;

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Pet order accepted",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

exports.riderRejectPetOrder =
async (req, res) => {
  try {

    const order =
      await PetOrder.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus =
      "CANCELLED";

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Pet order rejected",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};