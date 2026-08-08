// ================================
// controllers/petOrderController.js
// ================================

const PetOrder = require(
  "../models/PetOrder"
);

// ================================
// CREATE ORDER
// ================================

exports.createPetOrder = async (
  req,
  res
) => {
  try {
    const {
      customerName,
      productName,
      quantity,
      total,
      status,
      petEmoji,
    } = req.body;

    const order =
      await PetOrder.create({
        customerName,
        productName,
        quantity,
        total,
        status,
        petEmoji,
      });

    res.status(201).json({
      success: true,
      message:
        "Pet order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================================
// GET ALL ORDERS
// ================================

exports.getAllPetOrders =
  async (req, res) => {
    try {
      const orders =
        await PetOrder.find().sort({
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

// ================================
// GET SINGLE ORDER
// ================================

exports.getSinglePetOrder =
  async (req, res) => {
    try {
      const order =
        await PetOrder.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Pet order not found",
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

// ================================
// UPDATE ORDER
// ================================

exports.updatePetOrder =
  async (req, res) => {
    try {
      const order =
        await PetOrder.findByIdAndUpdate(
          req.params.id,
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
            "Pet order not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Pet order updated successfully",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ================================
// DELETE ORDER
// ================================

exports.deletePetOrder =
  async (req, res) => {
    try {
      const order =
        await PetOrder.findByIdAndDelete(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Pet order not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Pet order deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };