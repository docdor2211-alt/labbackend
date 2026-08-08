// controllers/pharmacyProductController.js

const PharmacyProduct = require(
  "../models/pharmacyProductModel"
);


// ======================================================
// CREATE PRODUCT
// ======================================================

const createProduct =
  async (req, res) => {

    try {

      const {

        productTitle,

        brand,

        category,

        description,

        mrp,

        discount,

        stock,

        gst,

        expiryDate,

        prescriptionRequired,

        image,

      } = req.body;


      // ==================================================
      // VALIDATION
      // ==================================================

      if (

        !productTitle ||

        !brand ||

        !category ||

        !mrp

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Required fields missing",

        });

      }


      // ==================================================
      // CREATE PRODUCT
      // ==================================================

      const product =
        await PharmacyProduct.create({

          pharmacy:
            req.user.id,

          productTitle,

          brand,

          category,

          description,

          mrp,

          discount,

          stock,

          gst,

          expiryDate,

          prescriptionRequired,

          image,

        });


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(201).json({

        success: true,

        message:
          "Product created successfully",

        data: product,

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
// GET MY PRODUCTS
// ======================================================

const getAllProducts =
  async (req, res) => {

    try {

      const products =
        await PharmacyProduct.find({

          pharmacy:
            req.user.id,

        })

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        pharmacyId:
          req.user.id,

        totalProducts:
          products.length,

        data: products,

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
// GET SINGLE PRODUCT
// ======================================================

const getSingleProduct =
  async (req, res) => {

    try {

      const product =
        await PharmacyProduct.findOne({

          _id:
            req.params.id,

          pharmacy:
            req.user.id,

        });

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",

        });

      }

      res.status(200).json({

        success: true,

        data: product,

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
// UPDATE PRODUCT
// ======================================================

const updateProduct =
  async (req, res) => {

    try {

      const product =
        await PharmacyProduct.findOneAndUpdate(

          {

            _id:
              req.params.id,

            pharmacy:
              req.user.id,

          },

          req.body,

          {

            new: true,

            runValidators: true,

          }

        );

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",

        });

      }

      res.status(200).json({

        success: true,

        message:
          "Product updated successfully",

        data: product,

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
// DELETE PRODUCT
// ======================================================

const deleteProduct =
  async (req, res) => {

    try {

      const product =
        await PharmacyProduct.findOneAndDelete({

          _id:
            req.params.id,

          pharmacy:
            req.user.id,

        });

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",

        });

      }

      res.status(200).json({

        success: true,

        message:
          "Product deleted successfully",

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
// EXPORTS
// ======================================================

module.exports = {

  createProduct,

  getAllProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,

};