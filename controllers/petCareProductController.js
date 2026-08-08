

// // ======================================================
// // controllers/petCareProductController.js
// // ======================================================

// const PetCareProduct =
//   require(
//     "../models/petCareProductModel"
//   );

// // ======================================================
// // CREATE PRODUCT
// // ======================================================

// exports.createPetCareProduct =
//   async (req, res) => {

//     try {

//       const product =
//         await PetCareProduct.create(

//           req.body

//         );

//       res.status(201).json({

//         success: true,

//         message:
//           "Pet care product created successfully",

//         data: product,

//       });

//     } catch (error) {

//       console.log(error);

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };

// // ======================================================
// // GET ALL PRODUCTS
// // ======================================================

// exports.getAllPetCareProducts =
//   async (req, res) => {

//     try {

//       const products =
//         await PetCareProduct.find()

//           .sort({

//             createdAt: -1,

//           });

//       res.status(200).json({

//         success: true,

//         count:
//           products.length,

//         data:
//           products,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };

// // ======================================================
// // GET SINGLE PRODUCT
// // ======================================================

// exports.getSinglePetCareProduct =
//   async (req, res) => {

//     try {

//       const product =
//         await PetCareProduct.findById(

//           req.params.id

//         );

//       if (!product) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Product not found",

//         });

//       }

//       res.status(200).json({

//         success: true,

//         data:
//           product,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };

// // ======================================================
// // UPDATE PRODUCT
// // ======================================================

// exports.updatePetCareProduct =
//   async (req, res) => {

//     try {

//       const product =
//         await PetCareProduct.findByIdAndUpdate(

//           req.params.id,

//           req.body,

//           {

//             new: true,

//             runValidators: true,

//           }

//         );

//       if (!product) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Product not found",

//         });

//       }

//       res.status(200).json({

//         success: true,

//         message:
//           "Product updated successfully",

//         data:
//           product,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };

// // ======================================================
// // DELETE PRODUCT
// // ======================================================

// exports.deletePetCareProduct =
//   async (req, res) => {

//     try {

//       const product =
//         await PetCareProduct.findById(

//           req.params.id

//         );

//       if (!product) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Product not found",

//         });

//       }

//       await product.deleteOne();

//       res.status(200).json({

//         success: true,

//         message:
//           "Product deleted successfully",

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };



const PetCareProduct =
  require(
    "../models/petCareProductModel"
  );



// ======================================================
// CREATE PRODUCT
// ======================================================

exports.createPetCareProduct =
  async (req, res) => {

    try {

      const product =
        await PetCareProduct.create({

          ...req.body,

          pharmacyId:
            req.user.id,

        });

      res.status(201).json({

        success: true,

        message:
          "Pet care product created successfully",

        data:
          product,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// GET ALL PRODUCTS
// ======================================================

exports.getAllPetCareProducts =
  async (req, res) => {

    try {

      const products =
        await PetCareProduct.find({

          pharmacyId:
            req.user.id,

        })

          .sort({

            createdAt: -1,

          });

      res.status(200).json({

        success: true,

        count:
          products.length,

        data:
          products,

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

exports.getSinglePetCareProduct =
  async (req, res) => {

    try {

      const product =
        await PetCareProduct.findOne({

          _id:
            req.params.id,

          pharmacyId:
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

        data:
          product,

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

exports.updatePetCareProduct =
  async (req, res) => {

    try {

      const product =
        await PetCareProduct.findOneAndUpdate(

          {

            _id:
              req.params.id,

            pharmacyId:
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

        data:
          product,

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

exports.deletePetCareProduct =
  async (req, res) => {

    try {

      const product =
        await PetCareProduct.findOne({

          _id:
            req.params.id,

          pharmacyId:
            req.user.id,

        });

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",

        });

      }

      await product.deleteOne();

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