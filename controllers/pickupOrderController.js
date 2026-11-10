const mongoose = require("mongoose");
const PickupOrder = require("../models/pickupOrderModel");
require("../models/PharmacyUser");
const {
  parseNonNegativeNumber,
  reserveInventory,
  releaseInventory,
} = require("../utils/pharmacyInventorySync");

const VALID_PICKUP_STATUSES = [
  "pending",
  "ready",
  "completed",
  "cancelled",
  "delivery",
];

// ======================================================
// CREATE PICKUP ORDER
// ======================================================

const createPickupOrder = async (req, res) => {
  let reservedItems = [];
  try {
    const {
      orderId,
      customerName,
      customerPhone,
      pickupTime,
      status,
      items,
      totalAmount,
      address,
    } = req.body;

    if (!customerName?.trim() || !customerPhone?.trim() || !pickupTime?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name, phone and pickup time are required",
      });
    }

    if (status && !VALID_PICKUP_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup order status",
      });
    }

    if (totalAmount !== undefined) {
      const parsedTotal = parseNonNegativeNumber(totalAmount);
      if (parsedTotal === null) {
        return res.status(400).json({
          success: false,
          message: "Total amount must be a valid non-negative number",
        });
      }
    }

    reservedItems = await reserveInventory(req.user.id, items || []);

    const computedTotal =
      Math.round(
        reservedItems.reduce(
          (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
          0
        ) * 100
      ) / 100;
    const requestedTotal =
      totalAmount !== undefined ? parseNonNegativeNumber(totalAmount) : null;
    const finalTotal =
      requestedTotal !== null && (requestedTotal > 0 || computedTotal === 0)
        ? requestedTotal
        : computedTotal;

    const order = await PickupOrder.create({
      pharmacy: req.user.id,
      orderId: orderId || "ORD-" + Date.now(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      pickupTime: pickupTime.trim(),
      status: status || "pending",
      items: reservedItems,
      inventoryAdjusted: reservedItems.length > 0,
      totalAmount: finalTotal,
      address: address ? String(address).trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "Pickup order created successfully",
      data: order,
    });
  } catch (error) {
    if (reservedItems.length > 0) {
      await releaseInventory(req.user.id, reservedItems);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      ...(error.code ? { code: error.code } : {}),
      ...(error.productId ? { productId: error.productId } : {}),
      ...(error.availableStock !== undefined
        ? { availableStock: error.availableStock }
        : {}),
      ...(error.requestedQuantity !== undefined
        ? { requestedQuantity: error.requestedQuantity }
        : {}),
    });
  }
};

// ======================================================
// GET LOGIN PHARMACY PICKUP ORDERS
// ======================================================

const getAllPickupOrders = async (req, res) => {
  try {
    const orders = await PickupOrder.find({
      pharmacy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    const total = orders.length;
    const ready = orders.filter((o) => o.status === "ready").length;
    const pending = orders.filter((o) => o.status === "pending").length;

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
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL PHARMACY PICKUP ORDERS
// ======================================================

const getAllPharmacyPickupOrders = async (req, res) => {
  try {
    const orders = await PickupOrder.find()
      .populate({
        path: "pharmacy",
        select: "name email phone",
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      total: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE PICKUP ORDER STATUS
// ======================================================

const updatePickupOrderStatus = async (req, res) => {
  let newlyReserved = null;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const nextStatus = req.body.status;
    if (!VALID_PICKUP_STATUSES.includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup order status",
      });
    }

    const order = await PickupOrder.findOne({
      _id: req.params.id,
      pharmacy: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (nextStatus === "cancelled") {
      if (order.status === "completed") {
        return res.status(400).json({
          success: false,
          message: "Completed pickup order cannot be cancelled",
        });
      }

      if (order.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Pickup order is already cancelled",
        });
      }

      const claimed = await PickupOrder.findOneAndUpdate(
        {
          _id: order._id,
          pharmacy: req.user.id,
          status: { $nin: ["completed", "cancelled"] },
        },
        {
          $set: {
            status: "cancelled",
            inventoryAdjusted: false,
          },
        },
        { new: false }
      );

      if (!claimed) {
        return res.status(400).json({
          success: false,
          message: "Pickup order cannot be cancelled in its current state",
        });
      }

      if (claimed.inventoryAdjusted) {
        await releaseInventory(claimed.pharmacy || req.user.id, claimed.items);
      }

      const updatedOrder = await PickupOrder.findById(claimed._id);
      return res.status(200).json({
        success: true,
        message: "Pickup order status updated",
        data: updatedOrder,
      });
    }

    const updateFields = { status: nextStatus };

    if (
      order.status === "cancelled" &&
      nextStatus !== "cancelled" &&
      !order.inventoryAdjusted
    ) {
      newlyReserved = await reserveInventory(req.user.id, order.items);
      updateFields.items = newlyReserved;
      updateFields.inventoryAdjusted = newlyReserved.length > 0;
    }

    const updatedOrder = await PickupOrder.findOneAndUpdate(
      {
        _id: order._id,
        pharmacy: req.user.id,
        ...(newlyReserved ? { status: "cancelled", inventoryAdjusted: { $ne: true } } : {}),
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      if (newlyReserved?.length) {
        await releaseInventory(req.user.id, newlyReserved);
        newlyReserved = null;
      }
      return res.status(409).json({
        success: false,
        message: "Pickup order state changed concurrently; status could not be updated",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pickup order status updated",
      data: updatedOrder,
    });
  } catch (error) {
    if (newlyReserved?.length) {
      try {
        await releaseInventory(req.user.id, newlyReserved);
      } catch (_) {}
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      ...(error.code ? { code: error.code } : {}),
      ...(error.availableStock !== undefined
        ? { availableStock: error.availableStock }
        : {}),
      ...(error.requestedQuantity !== undefined
        ? { requestedQuantity: error.requestedQuantity }
        : {}),
    });
  }
};

// ======================================================
// DELIVERY ORDER API
// ======================================================

const markAsDelivery = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await PickupOrder.findOne({
      _id: req.params.id,
      pharmacy: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "cancelled" || order.status === "completed") {
      return res.status(400).json({
        success: false,
        message: `${order.status} pickup order cannot move to delivery`,
      });
    }

    order.status = "delivery";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order moved to delivery",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// DELETE ORDER
// ======================================================

const deletePickupOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await PickupOrder.findOneAndDelete({
      _id: req.params.id,
      pharmacy: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.inventoryAdjusted && order.status !== "cancelled") {
      await releaseInventory(order.pharmacy || req.user.id, order.items);
    }

    res.status(200).json({
      success: true,
      message: "Pickup order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
