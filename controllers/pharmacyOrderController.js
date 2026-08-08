
const PharmacyOrder = require(
  "../models/pharmacyOrderModel"
);


// ======================================================
// CREATE ORDER
// ======================================================

const createOrder =
  async (req, res) => {

    try {

      const {

        patient,

        date,

        items,

        address,

        total,

      } = req.body;


      // ==================================================
      // VALIDATION
      // ==================================================

      if (

        !patient ||

        !date ||

        !address

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Patient, date and address are required",

        });

      }


      // ==================================================
      // CREATE ORDER
      // ==================================================

      const order =
        await PharmacyOrder.create({

          pharmacy:
            req.user.id,

          patient,

          date,

          items,

          address,

          total,

        });


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(201).json({

        success: true,

        message:
          "Order created successfully",

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


// ======================================================
// GET LOGIN PHARMACY ORDERS
// ======================================================

const getAllOrders =
  async (req, res) => {

    try {

      const orders =
        await PharmacyOrder.find({

          pharmacy:
            req.user.id,

        })

        .populate({

          path: "pharmacy",

          select:
            "name email phone",

        })

        .sort({

          createdAt: -1,

        });


      // ==================================================
      // ORDER COUNTS
      // ==================================================

      const totalOrders =
        orders.length;

      const pendingOrders =
        orders.filter(

          (order) =>

            order.status ===
            "Pending"

        ).length;

      const acceptedOrders =
        orders.filter(

          (order) =>

            order.status ===
            "Accepted"

        ).length;

      const deliveryOrders =
        orders.filter(

          (order) =>

            order.status ===
            "Out For Delivery"

        ).length;

      const deliveredOrders =
        orders.filter(

          (order) =>

            order.status ===
            "Delivered"

        ).length;

      const cancelledOrders =
        orders.filter(

          (order) =>

            order.status ===
            "Cancelled"

        ).length;


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json({

        success: true,

        pharmacyId:
          req.user.id,

        totalOrders,

        pendingOrders,

        acceptedOrders,

        deliveryOrders,

        deliveredOrders,

        cancelledOrders,

        data: orders,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};


// ======================================================
// GET ALL PHARMACY ORDERS
// ======================================================

const getAllPharmacyOrders =
  async (req, res) => {

    try {

      const orders =
        await PharmacyOrder.find()

        .populate({

          path: "pharmacy",

          select:
            "name email phone",

        })

        .sort({

          createdAt: -1,

        });

      res.status(200).json({

        success: true,

        totalOrders:
          orders.length,

        data: orders,

      });

    } catch (error) {

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

const getSingleOrder =
  async (req, res) => {

    try {

      const order =
        await PharmacyOrder.findOne({

          _id:
            req.params.id,

          pharmacy:
            req.user.id,

        });

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }

      res.status(200).json({

        success: true,

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


// ======================================================
// ACCEPT / CANCEL ORDER
// ======================================================

const updateOrderStatus =
  async (req, res) => {

    try {

      const { status } =
        req.body;


      // ==================================================
      // VALID STATUS
      // ==================================================

      const validStatus = [

        "Accepted",

        "Cancelled",

      ];

      if (

        !validStatus.includes(
          status
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Status must be Accepted or Cancelled",

        });

      }


      // ==================================================
      // FIND ORDER
      // ==================================================

      const order =
        await PharmacyOrder.findOne({

          _id:
            req.params.id,

          pharmacy:
            req.user.id,

        });

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }


      // ==================================================
      // UPDATE STATUS
      // ==================================================

      order.status =
        status;

      await order.save();


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json({

        success: true,

        message:
          `Order ${status} successfully`,

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


// ======================================================
// OUT FOR DELIVERY
// ======================================================

const markOrderAsDelivery =
  async (req, res) => {

    try {

      const order =
        await PharmacyOrder.findOne({

          _id:
            req.params.id,

          pharmacy:
            req.user.id,

        });

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }


      // ==================================================
      // CANCEL CHECK
      // ==================================================

      if (

        order.status ===
        "Cancelled"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Cancelled order cannot move to delivery",

        });

      }


      // ==================================================
      // UPDATE STATUS
      // ==================================================

      order.status =
        "Out For Delivery";

      await order.save();


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json({

        success: true,

        message:
          "Order moved to delivery successfully",

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


// ======================================================
// MARK ORDER AS DELIVERED
// ======================================================

const markOrderAsDelivered =
  async (req, res) => {

    try {

      const order =
        await PharmacyOrder.findOne({

          _id:
            req.params.id,

          pharmacy:
            req.user.id,

        });

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }

      order.status =
        "Delivered";

      await order.save();

      res.status(200).json({

        success: true,

        message:
          "Order delivered successfully",

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


// ======================================================
// UPDATE FULL ORDER
// ======================================================

const updateOrder =
  async (req, res) => {

    try {

      const order =
        await PharmacyOrder.findOneAndUpdate(

          {

            _id:
              req.params.id,

            pharmacy:
              req.user.id,

          },

          req.body,

          {

            new: true,

            runValidators: true,

          }

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

        message:
          "Order updated successfully",

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


// ======================================================
// DELETE ORDER
// ======================================================

const deleteOrder =
  async (req, res) => {

    try {

      const order =
        await PharmacyOrder.findOneAndDelete({

          _id:
            req.params.id,

          pharmacy:
            req.user.id,

        });

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }

      res.status(200).json({

        success: true,

        message:
          "Order deleted successfully",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};



// ======================================
// RIDER ACCEPT PHARMACY ORDER
// ======================================
const riderAcceptOrder = async (req, res) => {
  try {

    const order = await PharmacyOrder.findByIdAndUpdate(
      req.params.id,
      {
        status: "Accepted",
        riderId: req.body.riderId
      },
      {
        new: true,
        runValidators: false
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      data: order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// ======================================
// RIDER REJECT PHARMACY ORDER
// ======================================
const riderRejectOrder = async (req, res) => {
  try {

    const order = await PharmacyOrder.findByIdAndUpdate(
      req.params.id,
      {
        status: "Cancelled"
      },
      {
        new: true,
        runValidators: false
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      data: order
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  createOrder,

  getAllOrders,

  getAllPharmacyOrders,

  getSingleOrder,

  updateOrderStatus,

  markOrderAsDelivery,

  markOrderAsDelivered,

  updateOrder,

  deleteOrder,
   riderAcceptOrder,
  riderRejectOrder,

};