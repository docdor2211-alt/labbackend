const mongoose = require("mongoose");
const PharmacyProduct = require("../models/pharmacyProductModel");
const PharmacyPurchase = require("../models/pharmacyPurchaseModel");

const allocatePurchaseBatches = async (pharmacyId, productId, quantity) => {
  const purchases = await PharmacyPurchase.find({
    pharmacy: pharmacyId,
    items: { $elemMatch: { product: productId, remainingQuantity: { $gt: 0 } } },
  }).select("items").lean();
  const candidates = purchases
    .flatMap((purchase) =>
      purchase.items
        .filter(
          (item) =>
            item.product.toString() === productId.toString() &&
            item.remainingQuantity > 0
        )
        .map((item) => ({
          purchaseId: purchase._id,
          item,
        }))
    )
    .sort((left, right) => {
      const leftExpiry = left.item.expiryDate || "9999-12-31";
      const rightExpiry = right.item.expiryDate || "9999-12-31";
      return leftExpiry.localeCompare(rightExpiry);
    });

  let remaining = quantity;
  const allocations = [];
  try {
    for (const candidate of candidates) {
      if (remaining === 0) break;
      const allocated = Math.min(remaining, candidate.item.remainingQuantity);
      const result = await PharmacyPurchase.updateOne(
        {
          _id: candidate.purchaseId,
          pharmacy: pharmacyId,
          items: {
            $elemMatch: {
              _id: candidate.item._id,
              remainingQuantity: { $gte: allocated },
            },
          },
        },
        { $inc: { "items.$.remainingQuantity": -allocated } }
      );
      if (result.modifiedCount === 1) {
        allocations.push({
          purchaseId: candidate.purchaseId,
          purchaseItemId: candidate.item._id,
          quantity: allocated,
        });
        remaining -= allocated;
      }
    }
  } catch (error) {
    for (const allocation of allocations) {
      await PharmacyPurchase.updateOne(
        { _id: allocation.purchaseId, pharmacy: pharmacyId, "items._id": allocation.purchaseItemId },
        { $inc: { "items.$.remainingQuantity": allocation.quantity } }
      );
    }
    throw error;
  }
  return allocations;
};

const inventoryError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const reserveInventory = async (pharmacyId, items = []) => {
  const reserved = [];
  const linkedItems = [];
  try {
    for (const item of items) {
      const quantity = Number(item.qty ?? item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw inventoryError("Order item quantity must be a positive whole number");
      }

      const productId = item.productId || item.product;
      const product = productId && mongoose.Types.ObjectId.isValid(productId)
        ? await PharmacyProduct.findOne({ _id: productId, pharmacy: pharmacyId })
        : await PharmacyProduct.findOne({
            pharmacy: pharmacyId,
            productTitle: new RegExp(
              `^${String(item.name || item.productTitle || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
              "i"
            ),
          });
      if (!product) {
        throw inventoryError(
          `No inventory product matches "${item.name || item.productTitle || "order item"}"`,
          404
        );
      }

      const updated = await PharmacyProduct.findOneAndUpdate(
        { _id: product._id, pharmacy: pharmacyId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
      if (!updated) {
        throw inventoryError(`Insufficient stock for ${product.productTitle}`, 409);
      }

      const reservation = {
        productId: product._id,
        quantity,
        inventoryAllocations: [],
      };
      reserved.push(reservation);
      const inventoryAllocations = await allocatePurchaseBatches(
        pharmacyId,
        product._id,
        quantity
      );
      reservation.inventoryAllocations = inventoryAllocations;
      linkedItems.push({
        ...(typeof item.toObject === "function" ? item.toObject() : item),
        productId: product._id,
        inventoryAllocations,
      });
    }
    return linkedItems;
  } catch (error) {
    await releaseInventory(pharmacyId, reserved);
    throw error;
  }
};

const releaseInventory = async (pharmacyId, items = []) => {
  for (const item of items) {
    const productId = item.productId || item.product;
    const quantity = Number(item.quantity ?? item.qty ?? item.quantity);
    if (
      productId &&
      mongoose.Types.ObjectId.isValid(productId) &&
      Number.isInteger(quantity) &&
      quantity > 0
    ) {
      await PharmacyProduct.updateOne(
        { _id: productId, pharmacy: pharmacyId },
        { $inc: { stock: quantity } }
      );
      for (const allocation of item.inventoryAllocations || []) {
        await PharmacyPurchase.updateOne(
          {
            _id: allocation.purchaseId,
            pharmacy: pharmacyId,
            "items._id": allocation.purchaseItemId,
          },
          { $inc: { "items.$.remainingQuantity": allocation.quantity } }
        );
      }
    }
  }
};

module.exports = { reserveInventory, releaseInventory };
