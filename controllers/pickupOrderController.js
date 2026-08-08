const PickupOrder = require(
  "../models/pickupOrderModel"
);


// ======================================================
// CREATE PICKUP ORDER
// ======================================================

const createPickupOrder =
  async (req, res) => {

    try {

      const order =
        await PickupOrder.create({

          pharmacy:
            req.user.id,

          orderId:
            req.body.orderId,

          customerName:
            req.body.customerName,

          customerPhone:
            req.body.customerPhone,

          pickupTime:
            req.body.pickupTime,

          status:
            req.body.status,

          items:
            req.body.items,

          totalAmount:
            req.body.totalAmount,

          address:
            req.body.address,

        });

      res.status(201).json({

        success: true,

        message:
          "Pickup order created successfully",

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
// GET LOGIN PHARMACY PICKUP ORDERS
// ======================================================

const getAllPickupOrders =
  async (req, res) => {

    try {

      const orders =
        await PickupOrder.find({

          pharmacy:
            req.user.id,

        })

        .sort({
          createdAt: -1,
        });

      const total =
        orders.length;

      const ready =
        orders.filter(
          (o) =>
            o.status === "ready"
        ).length;

      const pending =
        orders.filter(
          (o) =>
            o.status === "pending"
        ).length;

      res.status(200).json({

        success: true,

        total,

        ready,

        pending,

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
// GET ALL PHARMACY PICKUP ORDERS
// ======================================================

const getAllPharmacyPickupOrders =
  async (req, res) => {

    try {

      const orders =
        await PickupOrder.find()

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

        total:
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
// UPDATE PICKUP ORDER STATUS
// ======================================================

const updatePickupOrderStatus =
  async (req, res) => {

    try {

      const order =
        await PickupOrder.findOne({

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
        req.body.status;

      await order.save();

      res.status(200).json({

        success: true,

        message:
          "Pickup order status updated",

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
// DELIVERY ORDER API
// ======================================================

const markAsDelivery =
  async (req, res) => {

    try {

      const order =
        await PickupOrder.findOne({

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
        "delivery";

      await order.save();

      res.status(200).json({

        success: true,

        message:
          "Order moved to delivery",

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

const deletePickupOrder =
  async (req, res) => {

    try {

      const order =
        await PickupOrder.findOneAndDelete({

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
          "Pickup order deleted successfully",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};

module.exports = {

  createPickupOrder,

  getAllPickupOrders,

  getAllPharmacyPickupOrders,

  updatePickupOrderStatus,

  markAsDelivery,

  deletePickupOrder,

};