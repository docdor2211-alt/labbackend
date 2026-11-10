const mongoose = require("mongoose");
const PharmacyProduct = require("../models/pharmacyProductModel");
const PharmacyPurchase = require("../models/pharmacyPurchaseModel");
const {
  parsePositiveInt,
  parseNonNegativeNumber,
  formatPharmacyProduct,
  syncLinkedMedicineItemsForProduct,
} = require("../utils/pharmacyInventorySync");

const createPurchase = async (req, res) => {
  const increments = [];
  const appliedIncrements = [];
  let purchase;
  try {
    const {
      distributorName,
      invoiceNumber = "",
      purchaseDate,
      items,
    } = req.body;

    const date = new Date(purchaseDate);
    if (
      !distributorName?.trim() ||
      !Number.isFinite(date.getTime()) ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Distributor, purchase date and at least one product are required",
      });
    }

    const normalizedItems = [];
    for (const item of items) {
      const quantity = parsePositiveInt(item?.quantity);
      const unitCost = parseNonNegativeNumber(item?.unitCost);
      if (
        !item?.productId ||
        !mongoose.Types.ObjectId.isValid(item.productId) ||
        quantity === null ||
        unitCost === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each purchase item needs a valid product ID, positive whole-number quantity and non-negative unit cost",
        });
      }

      const product = await PharmacyProduct.findOne({
        _id: item.productId,
        pharmacy: req.user.id,
      });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      normalizedItems.push({
        product: product._id,
        productTitle: product.productTitle,
        batchNumber: (item.batchNumber || "").trim(),
        quantity,
        remainingQuantity: quantity,
        unitCost,
        expiryDate: item.expiryDate || "",
      });
      increments.push({ productId: product._id, quantity });
    }

    const totalAmount = normalizedItems.reduce(
      (total, item) => total + item.quantity * item.unitCost,
      0
    );
    purchase = await PharmacyPurchase.create({
      pharmacy: req.user.id,
      distributorName: distributorName.trim(),
      invoiceNumber: invoiceNumber.trim(),
      purchaseDate: date,
      items: normalizedItems,
      totalAmount,
    });

    for (const increment of increments) {
      const updatedProd = await PharmacyProduct.findOneAndUpdate(
        { _id: increment.productId, pharmacy: req.user.id },
        { $inc: { stock: increment.quantity } },
        { new: true }
      );
      if (!updatedProd) {
        throw new Error("Inventory could not be updated for a purchased product");
      }
      appliedIncrements.push(increment);
      await syncLinkedMedicineItemsForProduct(updatedProd);
    }

    return res.status(201).json({
      success: true,
      message: "Purchase saved and inventory updated",
      data: purchase,
    });
  } catch (error) {
    if (purchase) {
      await PharmacyPurchase.deleteOne({ _id: purchase._id, pharmacy: req.user.id });
    }
    for (const increment of appliedIncrements) {
      const reverted = await PharmacyProduct.findOneAndUpdate(
        {
          _id: increment.productId,
          pharmacy: req.user.id,
          stock: { $gte: increment.quantity },
        },
        { $inc: { stock: -increment.quantity } },
        { new: true }
      );
      if (reverted) {
        await syncLinkedMedicineItemsForProduct(reverted);
      }
    }
    console.error("CREATE PHARMACY PURCHASE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPurchases = async (req, res) => {
  try {
    const purchases = await PharmacyPurchase.find({ pharmacy: req.user.id })
      .sort({ purchaseDate: -1, createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      total: purchases.length,
      data: purchases,
    });
  } catch (error) {
    console.error("GET PHARMACY PURCHASES ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const [products, batches] = await Promise.all([
      PharmacyProduct.find({ pharmacy: req.user.id }).sort({ productTitle: 1 }).lean(),
      PharmacyPurchase.find({ pharmacy: req.user.id, "items.remainingQuantity": { $gt: 0 } })
        .select("distributorName purchaseDate items")
        .lean(),
    ]);

    const formattedProducts = products.map(formatPharmacyProduct);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nearExpiryLimit = new Date(today);
    nearExpiryLimit.setDate(nearExpiryLimit.getDate() + 90);
    const outOfStockProducts = formattedProducts.filter((product) => product.stock <= 0);
    const lowStockProducts = formattedProducts.filter(
      (product) => product.stock <= (product.lowStockThreshold ?? 10)
    );

    const nearExpiryBatches = [];
    for (const purchase of batches) {
      for (const item of purchase.items) {
        if (!item.expiryDate || item.remainingQuantity <= 0) continue;
        const expiry = new Date(item.expiryDate);
        if (Number.isFinite(expiry.getTime()) && expiry >= today && expiry <= nearExpiryLimit) {
          nearExpiryBatches.push({
            productId: item.product,
            productName: item.productTitle,
            distributorName: purchase.distributorName,
            batchNumber: item.batchNumber,
            remainingQuantity: item.remainingQuantity,
            expiryDate: item.expiryDate,
          });
        }
      }
    }
    const trackedUnits = new Map();
    for (const purchase of batches) {
      for (const item of purchase.items) {
        const key = item.product.toString();
        trackedUnits.set(key, (trackedUnits.get(key) || 0) + item.remainingQuantity);
      }
    }
    for (const product of products) {
      const untrackedUnits = Math.max(
        0,
        product.stock - (trackedUnits.get(product._id.toString()) || 0)
      );
      if (!product.expiryDate || untrackedUnits === 0) continue;
      const expiry = new Date(product.expiryDate);
      if (Number.isFinite(expiry.getTime()) && expiry >= today && expiry <= nearExpiryLimit) {
        nearExpiryBatches.push({
          productId: product._id,
          productName: product.productTitle,
          distributorName: "",
          batchNumber: "",
          remainingQuantity: untrackedUnits,
          expiryDate: product.expiryDate,
        });
      }
    }

    const totalUnits = formattedProducts.reduce((sum, product) => sum + product.stock, 0);
    const inventoryValue = formattedProducts.reduce(
      (sum, product) => sum + product.stock * product.mrp,
      0
    );
    return res.status(200).json({
      success: true,
      data: {
        productCount: formattedProducts.length,
        totalUnits,
        outOfStockCount: outOfStockProducts.length,
        lowStockCount: lowStockProducts.length,
        nearExpiryCount: nearExpiryBatches.length,
        inventoryValue,
        outOfStockProducts,
        lowStockProducts,
        nearExpiryBatches,
        products: formattedProducts,
      },
    });
  } catch (error) {
    console.error("GET PHARMACY ANALYTICS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPurchase, getPurchases, getAnalytics };
