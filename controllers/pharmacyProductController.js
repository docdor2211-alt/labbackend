const mongoose = require("mongoose");
const PharmacyProduct = require("../models/pharmacyProductModel");
require("../models/PharmacyUser");
const MedicineItem = require("../models/medicineItem.model");
const uploadToBunny = require("../config/bunny");
const {
  parseNonNegativeInt,
  parseNonNegativeNumber,
  formatPharmacyProduct,
  syncLinkedMedicineItemsForProduct,
} = require("../utils/pharmacyInventorySync");

const escapeRegex = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createProduct = async (req, res) => {
  try {
    const {
      productTitle,
      brand,
      category,
      description,
      mrp,
      discount,
      stock,
      lowStockThreshold,
      gst,
      expiryDate,
      prescriptionRequired,
      image,
    } = req.body;

    const numericMrp = parseNonNegativeNumber(mrp);
    const numericStock = stock !== undefined ? parseNonNegativeInt(stock) : 0;
    const numericDiscount =
      discount !== undefined ? parseNonNegativeNumber(discount) : 0;
    const numericThreshold =
      lowStockThreshold !== undefined
        ? parseNonNegativeInt(lowStockThreshold)
        : 10;

    if (
      !productTitle?.trim() ||
      !brand?.trim() ||
      !category?.trim() ||
      numericMrp === null ||
      numericMrp <= 0 ||
      numericStock === null ||
      numericDiscount === null ||
      numericDiscount < 0 ||
      numericDiscount > 100 ||
      numericThreshold === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a product name, brand, category, valid positive MRP, non-negative whole-number stock, low-stock threshold and discount (0-100)",
      });
    }

    const imageUrl = req.file
      ? await uploadToBunny(req.file, "pharmacy-products")
      : image || "";

    const product = await PharmacyProduct.create({
      pharmacy: req.user.id,
      productTitle: productTitle.trim(),
      brand: brand.trim(),
      category: category.trim(),
      description: description || "",
      mrp: numericMrp,
      discount: numericDiscount,
      stock: numericStock,
      lowStockThreshold: numericThreshold,
      gst: gst || "",
      expiryDate: expiryDate || "",
      prescriptionRequired:
        prescriptionRequired === true || prescriptionRequired === "true",
      image: imageUrl,
    });

    await syncLinkedMedicineItemsForProduct(product);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: formatPharmacyProduct(product),
    });
  } catch (error) {
    console.error("CREATE PHARMACY PRODUCT ERROR:", error);
    return res
      .status(error.name === "ValidationError" ? 400 : 500)
      .json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const query = { pharmacy: req.user.id };

    if (req.query.search) {
      const searchRegex = new RegExp(
        escapeRegex(String(req.query.search).trim()),
        "i"
      );
      query.$or = [
        { productTitle: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
      ];
    }

    if (req.query.category) {
      query.category = new RegExp(
        `^${escapeRegex(String(req.query.category).trim())}$`,
        "i"
      );
    }

    const products = await PharmacyProduct.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const formatted = products.map(formatPharmacyProduct);

    return res.status(200).json({
      success: true,
      pharmacyId: req.user.id,
      totalProducts: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("GET PHARMACY PRODUCTS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const product = await PharmacyProduct.findOne({
      _id: req.params.id,
      pharmacy: req.user.id,
    }).lean();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({
      success: true,
      data: formatPharmacyProduct(product),
    });
  } catch (error) {
    console.error("GET PHARMACY PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicProducts = async (req, res) => {
  try {
    const query = {};
    const rawPharmacyId = req.query.pharmacy || req.query.pharmacyId || "";

    if (rawPharmacyId) {
      if (!mongoose.Types.ObjectId.isValid(rawPharmacyId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid pharmacy ID" });
      }
      query.pharmacy = rawPharmacyId;
    }

    if (req.query.category) {
      query.category = new RegExp(
        `^${escapeRegex(String(req.query.category).trim())}$`,
        "i"
      );
    }

    if (req.query.brand) {
      query.brand = new RegExp(
        escapeRegex(String(req.query.brand).trim()),
        "i"
      );
    }

    if (req.query.search) {
      const searchRegex = new RegExp(
        escapeRegex(String(req.query.search).trim()),
        "i"
      );
      query.$or = [
        { productTitle: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ];
    }

    const inStockParam = String(req.query.inStock || "").toLowerCase();
    const hideOutOfStock =
      String(
        req.query.hideOutOfStock || req.query.excludeOutOfStock || ""
      ).toLowerCase() === "true";

    if (inStockParam === "true" || hideOutOfStock) {
      query.stock = { $gt: 0 };
    } else if (inStockParam === "false") {
      query.stock = { $lte: 0 };
    }

    const total = await PharmacyProduct.countDocuments(query);
    const hasLimit = Boolean(req.query.limit);
    const hasPage = Boolean(req.query.page);

    let findQuery = PharmacyProduct.find(query)
      .populate("pharmacy", "name phone licenseNumber rating")
      .sort({ createdAt: -1 });

    let page = 1;
    let limit = total;

    if (hasLimit || hasPage) {
      page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
      findQuery = findQuery.skip((page - 1) * limit).limit(limit);
    }

    const products = await findQuery.lean();
    const formatted = products.map(formatPharmacyProduct);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalProducts: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("GET PUBLIC PHARMACY PRODUCTS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicSingleProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const product = await PharmacyProduct.findById(req.params.id)
      .populate("pharmacy", "name phone licenseNumber rating")
      .lean();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      data: formatPharmacyProduct(product),
    });
  } catch (error) {
    console.error("GET PUBLIC SINGLE PHARMACY PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const {
      productTitle,
      brand,
      category,
      description,
      mrp,
      discount,
      stock,
      lowStockThreshold,
      gst,
      expiryDate,
      prescriptionRequired,
      image,
    } = req.body;

    const updates = {};

    if (productTitle !== undefined) {
      if (!String(productTitle).trim()) {
        return res.status(400).json({
          success: false,
          message: "Product title cannot be empty",
        });
      }
      updates.productTitle = String(productTitle).trim();
    }

    if (brand !== undefined) {
      if (!String(brand).trim()) {
        return res.status(400).json({
          success: false,
          message: "Brand cannot be empty",
        });
      }
      updates.brand = String(brand).trim();
    }

    if (category !== undefined) {
      if (!String(category).trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty",
        });
      }
      updates.category = String(category).trim();
    }

    if (description !== undefined) updates.description = description;
    if (gst !== undefined) updates.gst = gst;
    if (expiryDate !== undefined) updates.expiryDate = expiryDate;
    if (prescriptionRequired !== undefined) {
      updates.prescriptionRequired =
        prescriptionRequired === true || prescriptionRequired === "true";
    }

    if (mrp !== undefined) {
      const numericMrp = parseNonNegativeNumber(mrp);
      if (numericMrp === null || numericMrp <= 0) {
        return res.status(400).json({
          success: false,
          message: "MRP must be a positive number",
        });
      }
      updates.mrp = numericMrp;
    }

    if (discount !== undefined) {
      const numericDiscount = parseNonNegativeNumber(discount);
      if (numericDiscount === null || numericDiscount < 0 || numericDiscount > 100) {
        return res.status(400).json({
          success: false,
          message: "Discount must be between 0 and 100",
        });
      }
      updates.discount = numericDiscount;
    }

    if (stock !== undefined) {
      const numericStock = parseNonNegativeInt(stock);
      if (numericStock === null) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative whole number",
        });
      }
      updates.stock = numericStock;
    }

    if (lowStockThreshold !== undefined) {
      const numericThreshold = parseNonNegativeInt(lowStockThreshold);
      if (numericThreshold === null) {
        return res.status(400).json({
          success: false,
          message: "Low stock threshold must be a non-negative whole number",
        });
      }
      updates.lowStockThreshold = numericThreshold;
    }

    if (req.file) {
      updates.image = await uploadToBunny(req.file, "pharmacy-products");
    } else if (image !== undefined) {
      updates.image = image;
    }

    const product = await PharmacyProduct.findOneAndUpdate(
      { _id: req.params.id, pharmacy: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await syncLinkedMedicineItemsForProduct(product);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: formatPharmacyProduct(product),
    });
  } catch (error) {
    console.error("UPDATE PHARMACY PRODUCT ERROR:", error);
    return res
      .status(error.name === "ValidationError" ? 400 : 500)
      .json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const product = await PharmacyProduct.findOneAndDelete({
      _id: req.params.id,
      pharmacy: req.user.id,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await MedicineItem.updateMany(
      { pharmacyProduct: product._id },
      { $set: { pharmacyProduct: null } }
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PHARMACY PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getPublicProducts,
  getPublicSingleProduct,
  updateProduct,
  deleteProduct,
};
