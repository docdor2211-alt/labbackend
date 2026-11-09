
const mongoose = require("mongoose");

const medicineItemSchema = new mongoose.Schema(
  {
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PharmacyUser",
      default: null,
      index: true,
    },

    pharmacyProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PharmacyProduct",
      default: null,
      index: true,
    },

    medicineCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicineCategory",
      required: false,
    },

    medicineSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicineSubCategory",
      required: false,
    },

    subCategoryId: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    productTitle: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      default: "Strip of tablets",
      trim: true,
    },

    delivery: {
      type: String,
      default: "Delivery by Tomorrow 9 PM",
      trim: true,
    },

    newPrice: {
      type: Number,
      default: 0,
    },

    oldPrice: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      default: 0,
    },

    mrp: {
      type: Number,
      default: 0,
    },

    discount: {
      type: String,
      default: "",
      trim: true,
    },

    prescription: {
      type: Boolean,
      default: false,
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        url: "",
        publicId: "",
      },
    },

    medicineItems: {
      type: [String],
      default: [],
    },

    quantity: {
      type: Number,
      default: 1,
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: (value) => Number.isInteger(value) && value >= 0,
        message: "Stock must be a non-negative whole number",
      },
    },

    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Low stock threshold cannot be negative"],
      validate: {
        validator: (value) => Number.isInteger(value) && value >= 0,
        message: "Low stock threshold must be a non-negative whole number",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

medicineItemSchema.pre("validate", function () {
  if (this.stock === null || this.stock === undefined) {
    this.stock = 0;
  }
  if (this.lowStockThreshold === null || this.lowStockThreshold === undefined) {
    this.lowStockThreshold = 10;
  }
});

// Pre-save hook to synchronize aliases and computed fields
medicineItemSchema.pre("save", function () {
  const resolvedName = (
    this.name ||
    this.productTitle ||
    this.description ||
    ""
  ).trim();
  if (!this.description && resolvedName) {
    this.description = resolvedName;
  }
  if (!this.name && resolvedName) {
    this.name = resolvedName;
  }
  if (!this.productTitle && resolvedName) {
    this.productTitle = resolvedName;
  }

  if (this.newPrice === 0 && this.price > 0) {
    this.newPrice = this.price;
  } else if (this.price === 0 && this.newPrice > 0) {
    this.price = this.newPrice;
  }

  if (this.oldPrice === 0 && this.mrp > 0) {
    this.oldPrice = this.mrp;
  } else if (this.mrp === 0 && this.oldPrice > 0) {
    this.mrp = this.oldPrice;
  }

  if (
    !this.discount &&
    this.oldPrice > this.newPrice &&
    this.oldPrice > 0 &&
    this.newPrice > 0
  ) {
    const pct = Math.round(
      ((this.oldPrice - this.newPrice) / this.oldPrice) * 100
    );
    if (pct > 0) {
      this.discount = `${pct}% OFF`;
    }
  }

  if (!this.subCategoryId && this.medicineSubCategory) {
    this.subCategoryId = this.medicineSubCategory.toString();
  } else if (!this.medicineSubCategory && this.subCategoryId) {
    if (mongoose.Types.ObjectId.isValid(this.subCategoryId)) {
      this.medicineSubCategory = this.subCategoryId;
    }
  }

  if (!this.imageUrl) {
    if (typeof this.image === "string") {
      this.imageUrl = this.image;
    } else if (this.image && this.image.url) {
      this.imageUrl = this.image.url;
    }
  }
  if (!this.image || (typeof this.image === "object" && !this.image.url)) {
    if (this.imageUrl) {
      this.image = { url: this.imageUrl, publicId: "" };
    }
  }
});

module.exports =
  mongoose.models.MedicineItem ||
  mongoose.model("MedicineItem", medicineItemSchema);

