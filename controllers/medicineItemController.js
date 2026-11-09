const mongoose = require("mongoose");
const MedicineItem = require("../models/medicineItem.model");
require("../models/medicineCategory.model");
require("../models/medicineSubCategory.model");
const PharmacyProduct = require("../models/pharmacyProductModel");
const {
  parseNonNegativeInt,
  parsePositiveInt,
  parseNonNegativeNumber,
  buildStockMeta,
  enrichMedicineItemsWithLiveStock,
} = require("../utils/pharmacyInventorySync");

const escapeRegex = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function formatMedicineItem(item) {
  if (!item) return null;
  const doc = item.toObject ? item.toObject() : item;

  const newPrice = doc.newPrice ?? doc.price ?? doc.mrp ?? 0;
  const oldPrice =
    doc.oldPrice ??
    doc.originalPrice ??
    (doc.price && doc.price > newPrice ? doc.price : newPrice);

  let discount = doc.discount || "";
  if (!discount && oldPrice > newPrice && oldPrice > 0 && newPrice > 0) {
    const pct = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    if (pct > 0) {
      discount = `${pct}% OFF`;
    }
  }

  const imageUrl =
    doc.imageUrl ||
    (typeof doc.image === "string" ? doc.image : doc.image?.url || "");
  const image =
    doc.image ||
    (imageUrl
      ? { url: imageUrl, publicId: "" }
      : { url: "", publicId: "" });

  const subCatId = (
    doc.subCategoryId?._id ||
    doc.subCategoryId ||
    doc.medicineSubCategory?._id ||
    doc.medicineSubCategory ||
    ""
  ).toString();

  const resolvedTitle = (
    doc.name ||
    doc.productTitle ||
    doc.description ||
    ""
  ).trim();
  const description = (doc.description || resolvedTitle).trim();
  const stockMeta = buildStockMeta(doc.stock, doc.lowStockThreshold);

  return {
    ...doc,
    _id: doc._id?.toString() || "",
    id: doc._id?.toString() || "",
    pharmacy: doc.pharmacy || null,
    pharmacyProduct: doc.pharmacyProduct || null,
    name: resolvedTitle,
    productTitle: (doc.productTitle || resolvedTitle).trim(),
    description,
    type: doc.type || "Strip of tablets",
    delivery: doc.delivery || "Delivery by Tomorrow 9 PM",
    newPrice,
    oldPrice,
    price: newPrice,
    mrp: oldPrice,
    originalPrice: oldPrice,
    discount,
    prescription: Boolean(doc.prescription),
    imageUrl,
    image,
    subCategoryId: subCatId,
    medicineSubCategory: doc.medicineSubCategory || subCatId,
    medicineItems: Array.isArray(doc.medicineItems) ? doc.medicineItems : [],
    quantity: typeof doc.quantity === "number" ? doc.quantity : 1,
    ...stockMeta,
    isActive: doc.isActive !== undefined ? doc.isActive : true,
  };
}

// ==========================================
// CREATE MEDICINE
// ==========================================
exports.createMedicine = async (req, res) => {
  try {
    const {
      pharmacy,
      pharmacyProduct,
      medicineCategory,
      medicineSubCategory,
      subCategoryId,
      name,
      productTitle,
      description,
      price,
      newPrice,
      oldPrice,
      mrp,
      type,
      delivery,
      discount,
      prescription,
      image,
      imageUrl,
      quantity,
      stock,
      lowStockThreshold,
      isActive,
    } = req.body;

    if (pharmacy && !mongoose.Types.ObjectId.isValid(pharmacy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pharmacy ID",
      });
    }

    let linkedPharmacyProduct = null;
    if (pharmacyProduct) {
      if (!mongoose.Types.ObjectId.isValid(pharmacyProduct)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pharmacyProduct ID",
        });
      }
      linkedPharmacyProduct = await PharmacyProduct.findById(pharmacyProduct);
      if (!linkedPharmacyProduct) {
        return res.status(404).json({
          success: false,
          message: "Linked pharmacy product not found",
        });
      }
    }

    const targetSub = medicineSubCategory || subCategoryId;
    const displayName = (name || productTitle || description || "").trim();

    if (!targetSub || !displayName) {
      return res.status(400).json({
        success: false,
        message: "medicineSubCategory and name/description are required",
      });
    }

    const sellingPrice = parseNonNegativeNumber(newPrice ?? price ?? mrp ?? 0);
    const regularPrice = parseNonNegativeNumber(oldPrice ?? mrp ?? sellingPrice ?? 0);
    if (sellingPrice === null || regularPrice === null) {
      return res.status(400).json({
        success: false,
        message: "Valid non-negative price and MRP are required",
      });
    }

    let validatedQuantity = 1;
    if (quantity !== undefined) {
      validatedQuantity = parsePositiveInt(quantity);
      if (validatedQuantity === null) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive whole number",
        });
      }
    }

    let validatedStock = linkedPharmacyProduct ? linkedPharmacyProduct.stock : 0;
    if (stock !== undefined) {
      validatedStock = parseNonNegativeInt(stock);
      if (validatedStock === null) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative whole number",
        });
      }
    }

    let validatedThreshold = linkedPharmacyProduct
      ? linkedPharmacyProduct.lowStockThreshold ?? 10
      : 10;
    if (lowStockThreshold !== undefined) {
      validatedThreshold = parseNonNegativeInt(lowStockThreshold);
      if (validatedThreshold === null) {
        return res.status(400).json({
          success: false,
          message: "Low stock threshold must be a non-negative whole number",
        });
      }
    }

    let imgData = image || {};
    if (typeof imgData === "string") {
      imgData = { url: imgData, publicId: "" };
    } else if (!imgData.url && imageUrl) {
      imgData = { url: imageUrl, publicId: "" };
    }

    const medicine = await MedicineItem.create({
      pharmacy: pharmacy || linkedPharmacyProduct?.pharmacy || null,
      pharmacyProduct: linkedPharmacyProduct?._id || null,
      medicineCategory: medicineCategory || null,
      medicineSubCategory: targetSub,
      subCategoryId: targetSub ? targetSub.toString() : "",
      name: displayName,
      productTitle: (productTitle || displayName).trim(),
      description: description || displayName,
      price: sellingPrice,
      newPrice: sellingPrice,
      oldPrice: regularPrice,
      mrp: regularPrice,
      type: type || "Strip of tablets",
      delivery: delivery || "Delivery by Tomorrow 9 PM",
      discount: discount || "",
      prescription: Boolean(prescription),
      image: imgData,
      imageUrl: imgData.url || imageUrl || "",
      quantity: validatedQuantity,
      stock: validatedStock,
      lowStockThreshold: validatedThreshold,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    const data = await MedicineItem.findById(medicine._id)
      .populate("medicineCategory")
      .populate("medicineSubCategory");

    const [enriched] = await enrichMedicineItemsWithLiveStock([data]);

    return res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: formatMedicineItem(enriched),
    });
  } catch (error) {
    console.error("CREATE MEDICINE ERROR =>", error);
    return res
      .status(error.name === "ValidationError" ? 400 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};

// ==========================================
// GET ALL MEDICINES
// ==========================================
exports.getMedicines = async (req, res) => {
  try {
    const query = {
      isActive: true,
    };

    if (req.query.search) {
      const escapedSearch = escapeRegex(String(req.query.search).trim());
      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { productTitle: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (req.query.medicineCategory) {
      if (!mongoose.Types.ObjectId.isValid(req.query.medicineCategory)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }
      query.medicineCategory = req.query.medicineCategory;
    }

    if (req.query.medicineSubCategory) {
      query.medicineSubCategory = req.query.medicineSubCategory;
    }

    if (req.query.pharmacy || req.query.pharmacyId) {
      const pharmacy = req.query.pharmacy || req.query.pharmacyId;
      if (!mongoose.Types.ObjectId.isValid(pharmacy)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pharmacy ID",
        });
      }
      query.pharmacy = pharmacy;
    }

    const rawList = await MedicineItem.find(query)
      .populate("medicineCategory", "title")
      .populate("medicineSubCategory", "title")
      .sort({ createdAt: -1 });

    let enriched = (await enrichMedicineItemsWithLiveStock(rawList)).map(
      formatMedicineItem
    );

    const inStockParam = String(req.query.inStock || "").toLowerCase();
    const hideOutOfStock =
      String(
        req.query.hideOutOfStock || req.query.excludeOutOfStock || ""
      ).toLowerCase() === "true";

    if (inStockParam === "true" || hideOutOfStock) {
      enriched = enriched.filter((item) => item.stock > 0);
    } else if (inStockParam === "false") {
      enriched = enriched.filter((item) => item.stock <= 0);
    }

    const total = enriched.length;
    const hasLimit = Boolean(req.query.limit);
    const hasPage = Boolean(req.query.page);

    let page = 1;
    let limit = total;
    let data = enriched;

    if (hasLimit || hasPage) {
      page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
      const skip = (page - 1) * limit;
      data = enriched.slice(skip, skip + limit);
    }

    return res.json({
      success: true,
      page,
      limit,
      total,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET BY CATEGORY
// ==========================================
exports.getByCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const raw = await MedicineItem.find({
      medicineCategory: req.params.id,
      isActive: true,
    })
      .populate("medicineCategory", "title")
      .populate("medicineSubCategory", "title");

    let data = (await enrichMedicineItemsWithLiveStock(raw)).map(
      formatMedicineItem
    );

    const inStockParam = String(req.query.inStock || "").toLowerCase();
    const hideOutOfStock =
      String(
        req.query.hideOutOfStock || req.query.excludeOutOfStock || ""
      ).toLowerCase() === "true";

    if (inStockParam === "true" || hideOutOfStock) {
      data = data.filter((item) => item.stock > 0);
    } else if (inStockParam === "false") {
      data = data.filter((item) => item.stock <= 0);
    }

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET BY SUBCATEGORY
// ==========================================
exports.getBySubCategory = async (req, res) => {
  try {
    const subCatId = req.params.id;
    const orConditions = [{ subCategoryId: subCatId }];
    if (mongoose.Types.ObjectId.isValid(subCatId)) {
      orConditions.unshift({ medicineSubCategory: subCatId });
    }

    const raw = await MedicineItem.find({
      $or: orConditions,
      isActive: true,
    })
      .populate("medicineCategory", "title")
      .populate("medicineSubCategory", "title");

    let data = (await enrichMedicineItemsWithLiveStock(raw)).map(
      formatMedicineItem
    );

    const inStockParam = String(req.query.inStock || "").toLowerCase();
    const hideOutOfStock =
      String(
        req.query.hideOutOfStock || req.query.excludeOutOfStock || ""
      ).toLowerCase() === "true";

    if (inStockParam === "true" || hideOutOfStock) {
      data = data.filter((item) => item.stock > 0);
    } else if (inStockParam === "false") {
      data = data.filter((item) => item.stock <= 0);
    }

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE MEDICINE
// ==========================================
exports.getMedicineById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const item = await MedicineItem.findById(req.params.id)
      .populate("medicineCategory", "title")
      .populate("medicineSubCategory", "title");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const [enriched] = await enrichMedicineItemsWithLiveStock([item]);

    return res.json({
      success: true,
      data: formatMedicineItem(enriched),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE MEDICINE
// ==========================================
exports.updateMedicine = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const medicine = await MedicineItem.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const {
      pharmacy,
      pharmacyProduct,
      medicineCategory,
      medicineSubCategory,
      subCategoryId,
      name,
      productTitle,
      description,
      price,
      newPrice,
      oldPrice,
      mrp,
      type,
      delivery,
      discount,
      prescription,
      image,
      imageUrl,
      quantity,
      stock,
      lowStockThreshold,
      isActive,
    } = req.body;

    if (pharmacy !== undefined) {
      if (pharmacy && !mongoose.Types.ObjectId.isValid(pharmacy)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pharmacy ID",
        });
      }
      medicine.pharmacy = pharmacy || null;
    }

    if (pharmacyProduct !== undefined) {
      if (pharmacyProduct) {
        if (!mongoose.Types.ObjectId.isValid(pharmacyProduct)) {
          return res.status(400).json({
            success: false,
            message: "Invalid pharmacyProduct ID",
          });
        }
        const linked = await PharmacyProduct.findById(pharmacyProduct);
        if (!linked) {
          return res.status(404).json({
            success: false,
            message: "Linked pharmacy product not found",
          });
        }
        medicine.pharmacyProduct = linked._id;
        medicine.pharmacy = medicine.pharmacy || linked.pharmacy;
        if (stock === undefined) {
          medicine.stock = linked.stock;
        }
      } else {
        medicine.pharmacyProduct = null;
      }
    }

    if (medicineCategory !== undefined) medicine.medicineCategory = medicineCategory;
    if (medicineSubCategory !== undefined || subCategoryId !== undefined) {
      const targetSub = medicineSubCategory || subCategoryId;
      medicine.medicineSubCategory = targetSub;
      medicine.subCategoryId = targetSub ? targetSub.toString() : "";
    }

    if (name !== undefined) medicine.name = name;
    if (productTitle !== undefined) medicine.productTitle = productTitle;
    if (description !== undefined) medicine.description = description;
    if (type !== undefined) medicine.type = type;
    if (delivery !== undefined) medicine.delivery = delivery;

    if (newPrice !== undefined || price !== undefined) {
      const p = parseNonNegativeNumber(newPrice ?? price);
      if (p === null) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number",
        });
      }
      medicine.newPrice = p;
      medicine.price = p;
    }

    if (oldPrice !== undefined || mrp !== undefined) {
      const op = parseNonNegativeNumber(oldPrice ?? mrp);
      if (op === null) {
        return res.status(400).json({
          success: false,
          message: "MRP / oldPrice must be a valid non-negative number",
        });
      }
      medicine.oldPrice = op;
      medicine.mrp = op;
    }

    if (discount !== undefined) medicine.discount = discount;
    if (prescription !== undefined) medicine.prescription = Boolean(prescription);

    if (quantity !== undefined) {
      const parsedQty = parsePositiveInt(quantity);
      if (parsedQty === null) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive whole number",
        });
      }
      medicine.quantity = parsedQty;
    }

    if (stock !== undefined) {
      const parsedStock = parseNonNegativeInt(stock);
      if (parsedStock === null) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative whole number",
        });
      }
      medicine.stock = parsedStock;
    }

    if (lowStockThreshold !== undefined) {
      const parsedThreshold = parseNonNegativeInt(lowStockThreshold);
      if (parsedThreshold === null) {
        return res.status(400).json({
          success: false,
          message: "Low stock threshold must be a non-negative whole number",
        });
      }
      medicine.lowStockThreshold = parsedThreshold;
    }

    if (image !== undefined) {
      if (typeof image === "string") {
        medicine.image = { url: image, publicId: "" };
        medicine.imageUrl = image;
      } else if (image?.url !== undefined) {
        medicine.image = image;
        medicine.imageUrl = image.url;
      }
    } else if (imageUrl !== undefined) {
      medicine.imageUrl = imageUrl;
      medicine.image = { url: imageUrl, publicId: "" };
    }

    if (isActive !== undefined) medicine.isActive = Boolean(isActive);

    await medicine.save();

    if (
      (stock !== undefined || lowStockThreshold !== undefined) &&
      medicine.pharmacyProduct
    ) {
      const syncFields = {};
      if (stock !== undefined) syncFields.stock = medicine.stock;
      if (lowStockThreshold !== undefined) {
        syncFields.lowStockThreshold = medicine.lowStockThreshold;
      }

      const updatedProd = await PharmacyProduct.findByIdAndUpdate(
        medicine.pharmacyProduct,
        { $set: syncFields },
        { new: true }
      );
      if (updatedProd) {
        await MedicineItem.updateMany(
          { pharmacyProduct: updatedProd._id, _id: { $ne: medicine._id } },
          {
            $set: {
              stock: updatedProd.stock,
              lowStockThreshold: updatedProd.lowStockThreshold ?? 10,
            },
          }
        );
      }
    }

    const updatedDoc = await MedicineItem.findById(medicine._id)
      .populate("medicineCategory", "title")
      .populate("medicineSubCategory", "title");

    const [enriched] = await enrichMedicineItemsWithLiveStock([updatedDoc]);

    return res.json({
      success: true,
      message: "Medicine updated successfully",
      data: formatMedicineItem(enriched),
    });
  } catch (error) {
    return res
      .status(error.name === "ValidationError" ? 400 : 500)
      .json({
        success: false,
        message: error.message,
      });
  }
};

// ==========================================
// DELETE MEDICINE
// ==========================================
exports.deleteMedicine = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const deleted = await MedicineItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
