const mongoose = require("mongoose");
const PharmacyOrder = require("../models/pharmacyOrderModel");
require("../models/PharmacyUser");
const {
  parseNonNegativeNumber,
  reserveInventory,
  releaseInventory,
} = require("../utils/pharmacyInventorySync");

// ======================================================
// CREATE ORDER
// ======================================================

const createOrder = async (req, res) => {
  let reservedItems = [];
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

    if (!patient?.trim() || !date?.trim() || !address?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient, date and address are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one order item is required",
      });
    }

    if (total !== undefined) {
      const parsedTotal = parseNonNegativeNumber(total);
      if (parsedTotal === null) {
        return res.status(400).json({
          success: false,
          message: "Order total must be a valid non-negative number",
        });
      }
    }

    for (const item of items) {
      if (item?.price !== undefined) {
        const parsedPrice = parseNonNegativeNumber(item.price);
        if (parsedPrice === null) {
          return res.status(400).json({
            success: false,
            message: "Item price must be a valid non-negative number",
          });
        }
      }
    }

    // ==================================================
    // RESERVE INVENTORY & CREATE ORDER
    // ==================================================

    reservedItems = await reserveInventory(req.user.id, items);
    const normalizedItems = reservedItems.map((it) => {
      const qty = Number(it.qty ?? it.quantity);
      const price = Number(it.price ?? 0);
      return {
        ...it,
        qty,
        quantity: qty,
        price,
      };
    });

    const computedTotal =
      Math.round(
        normalizedItems.reduce((sum, it) => sum + it.qty * it.price, 0) * 100
      ) / 100;
    const requestedTotal =
      total !== undefined ? parseNonNegativeNumber(total) : null;
    const finalTotal =
      requestedTotal !== null && (requestedTotal > 0 || computedTotal === 0)
        ? requestedTotal
        : computedTotal;

    const order = await PharmacyOrder.create({
      pharmacy: req.user.id,
      patient: patient.trim(),
      date: date.trim(),
      items: normalizedItems,
      inventoryAdjusted: normalizedItems.length > 0,
      orderStatus: "PLACED",
      pharmacyStatus: "Pending",
      deliveryStatus: "Pending",
      address: address.trim(),
      deliveryAddress: address.trim(),
      total: finalTotal,
      totalAmount: finalTotal,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
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
// GET LOGIN PHARMACY ORDERS
// ======================================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await PharmacyOrder.find({
      pharmacy: req.user.id,
    })
      .populate({
        path: "pharmacy",
        select: "name email phone",
      })
      .sort({
        createdAt: -1,
      });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === "Pending").length;
    const acceptedOrders = orders.filter((order) => order.status === "Accepted").length;
    const deliveryOrders = orders.filter(
      (order) => order.status === "Out For Delivery"
    ).length;
    const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
    const cancelledOrders = orders.filter((order) => order.status === "Cancelled").length;

    res.status(200).json({
      success: true,
      pharmacyId: req.user.id,
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
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL PHARMACY ORDERS
// ======================================================

const getAllPharmacyOrders = async (req, res) => {
  try {
    const orders = await PharmacyOrder.find()
      .populate({
        path: "pharmacy",
        select: "name email phone",
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
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
// GET SINGLE ORDER
// ======================================================

const getSingleOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await PharmacyOrder.findOne({
      _id: req.params.id,
      pharmacy: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
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
// ACCEPT / CANCEL ORDER
// ======================================================

const updateOrderStatus = async (req, res) => {
  let newlyReserved = null;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { status } = req.body;
    const validStatus = ["Accepted", "Cancelled"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Accepted or Cancelled",
      });
    }

    const existing = await PharmacyOrder.findOne({
      _id: req.params.id,
      pharmacy: req.user.id,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      existing.status === "Delivered" ||
      existing.orderStatus === "DELIVERED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivered order status cannot be changed",
      });
    }

    if (status === "Cancelled") {
      if (
        existing.status === "Cancelled" ||
        existing.orderStatus === "CANCELLED"
      ) {
        return res.status(400).json({
          success: false,
          message: "Order is already cancelled",
        });
      }

      const claimed = await PharmacyOrder.findOneAndUpdate(
        {
          _id: existing._id,
          pharmacy: req.user.id,
          status: { $nin: ["Delivered", "Cancelled"] },
        },
        {
          $set: {
            status: "Cancelled",
            orderStatus: "CANCELLED",
            pharmacyStatus: "Rejected",
            cancelledAt: new Date(),
            inventoryAdjusted: false,
          },
        },
        { new: false }
      );

      if (!claimed) {
        return res.status(400).json({
          success: false,
          message: "Order cannot be cancelled in its current state",
        });
      }

      if (claimed.inventoryAdjusted) {
        await releaseInventory(claimed.pharmacy || req.user.id, claimed.items);
      }

      const updatedOrder = await PharmacyOrder.findById(claimed._id);
      return res.status(200).json({
        success: true,
        message: "Order Cancelled successfully",
        data: updatedOrder,
      });
    }

    // status === "Accepted"
    const updateFields = {
      status: "Accepted",
      orderStatus: "CONFIRMED",
      pharmacyStatus: "Accepted",
    };

    if (!existing.inventoryAdjusted && existing.items?.length > 0) {
      newlyReserved = await reserveInventory(req.user.id, existing.items);
      updateFields.items = newlyReserved;
      updateFields.inventoryAdjusted = true;
    }

    const updatedOrder = await PharmacyOrder.findOneAndUpdate(
      {
        _id: existing._id,
        pharmacy: req.user.id,
        status: { $ne: "Delivered" },
        ...(newlyReserved ? { inventoryAdjusted: { $ne: true } } : {}),
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      if (newlyReserved?.length) {
        await releaseInventory(req.user.id, newlyReserved);
      }
      return res.status(400).json({
        success: false,
        message: "Order could not be accepted in its current state",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order Accepted successfully",
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
// OUT FOR DELIVERY
// ======================================================

const markOrderAsDelivery = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const existing = await PharmacyOrder.findOne({
      _id: req.params.id,
      pharmacy: req.user.id,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (existing.status === "Cancelled" || existing.orderStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot move to delivery",
      });
    }

    if (existing.status === "Delivered" || existing.orderStatus === "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot move back to delivery",
      });
    }

    const order = await PharmacyOrder.findOneAndUpdate(
      { _id: existing._id, pharmacy: req.user.id },
      {
        $set: {
          status: "Out For Delivery",
          orderStatus: "OUT_FOR_DELIVERY",
          deliveryStatus: "Out For Delivery",
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Order moved to delivery successfully",
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
// MARK ORDER AS DELIVERED
// ======================================================

const markOrderAsDelivered = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const existing = await PharmacyOrder.findOne({
      _id: req.params.id,
      pharmacy: req.user.id,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (existing.status === "Cancelled" || existing.orderStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be marked delivered",
      });
    }

    const order = await PharmacyOrder.findOneAndUpdate(
      { _id: existing._id, pharmacy: req.user.id },
      {
        $set: {
          status: "Delivered",
          orderStatus: "DELIVERED",
          deliveryStatus: "Delivered",
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Order delivered successfully",
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
// UPDATE FULL ORDER
// ======================================================

const updateOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const allowedFields = ["patient", "date", "address", "deliveryAddress", "total", "totalAmount"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if ((field === "total" || field === "totalAmount")) {
          const parsedTotal = parseNonNegativeNumber(req.body[field]);
          if (parsedTotal === null) {
            return res.status(400).json({
              success: false,
              message: "Order total must be a valid non-negative number",
            });
          }
          updates[field] = parsedTotal;
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    const order = await PharmacyOrder.findOneAndUpdate(
      {
        _id: req.params.id,
        pharmacy: req.user.id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
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

const deleteOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await PharmacyOrder.findOneAndDelete({
      _id: req.params.id,
      pharmacy: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.inventoryAdjusted &&
      order.status !== "Cancelled" &&
      order.orderStatus !== "CANCELLED"
    ) {
      await releaseInventory(order.pharmacy || req.user.id, order.items);
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// RIDER ACCEPT PHARMACY ORDER
// ======================================
const riderAcceptOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const existing = await PharmacyOrder.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (existing.status === "Cancelled" || existing.orderStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be accepted",
      });
    }

    const order = await PharmacyOrder.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "Accepted",
          orderStatus: "CONFIRMED",
          pharmacyStatus: "Accepted",
          riderId: req.body.riderId,
        },
      },
      {
        new: true,
        runValidators: false,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// RIDER REJECT PHARMACY ORDER
// ======================================
const riderRejectOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const existing = await PharmacyOrder.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (existing.status === "Delivered" || existing.orderStatus === "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be rejected",
      });
    }

    if (existing.status === "Cancelled" || existing.orderStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    const claimed = await PharmacyOrder.findOneAndUpdate(
      {
        _id: req.params.id,
        status: { $nin: ["Delivered", "Cancelled"] },
      },
      {
        $set: {
          status: "Cancelled",
          orderStatus: "CANCELLED",
          pharmacyStatus: "Rejected",
          cancelledAt: new Date(),
          inventoryAdjusted: false,
        },
      },
      {
        new: false,
        runValidators: false,
      }
    );

    if (!claimed) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be rejected in its current state",
      });
    }

    if (claimed.inventoryAdjusted) {
      await releaseInventory(claimed.pharmacy, claimed.items);
    }

    const updatedOrder = await PharmacyOrder.findById(claimed._id);

    return res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
