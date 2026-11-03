const PharmacyProduct = require("../models/pharmacyProductModel");
const uploadToBunny = require("../config/bunny");

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

    const numericMrp = Number(mrp);
    const numericStock = Number(stock ?? 0);
    const numericDiscount = Number(discount ?? 0);
    if (
      !productTitle?.trim() ||
      !brand?.trim() ||
      !category?.trim() ||
      !Number.isFinite(numericMrp) ||
      numericMrp <= 0 ||
      !Number.isInteger(numericStock) ||
      numericStock < 0 ||
      !Number.isFinite(numericDiscount) ||
      numericDiscount < 0 ||
      numericDiscount > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a product name, brand, category, valid MRP, stock and discount",
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
      lowStockThreshold: Number(lowStockThreshold ?? 10),
      gst: gst || "",
      expiryDate: expiryDate || "",
      prescriptionRequired: prescriptionRequired === true || prescriptionRequired === "true",
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("CREATE PHARMACY PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await PharmacyProduct.find({ pharmacy: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      pharmacyId: req.user.id,
      totalProducts: products.length,
      data: products,
    });
  } catch (error) {
    console.error("GET PHARMACY PRODUCTS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await PharmacyProduct.findOne({
      _id: req.params.id,
      pharmacy: req.user.id,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("GET PHARMACY PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "productTitle",
      "brand",
      "category",
      "description",
      "mrp",
      "discount",
      "gst",
      "expiryDate",
      "prescriptionRequired",
      "lowStockThreshold",
      "image",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (req.file) updates.image = await uploadToBunny(req.file, "pharmacy-products");

    const product = await PharmacyProduct.findOneAndUpdate(
      { _id: req.params.id, pharmacy: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("UPDATE PHARMACY PRODUCT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await PharmacyProduct.findOneAndDelete({
      _id: req.params.id,
      pharmacy: req.user.id,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
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
  updateProduct,
  deleteProduct,
};
