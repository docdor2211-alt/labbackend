// // const LabTest =
// //   require("../models/LabTestModel");

// // // ================= CREATE TEST =================

// // const createDiagnosticTest = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const {
// //       testName,
// //       category,
// //       price,
// //       description,
// //       image,
// //     } = req.body;

// //     // Validation
// //     if (
// //       !testName ||
// //       !category ||
// //       !price ||
// //       !description
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "All fields are required",
// //       });
// //     }

// //     // Create
// //     const test = await DiagnosticTest.create({
// //       testName,
// //       category,
// //       price,
// //       description,
// //       image,
// //     });

// //     res.status(201).json({
// //       success: true,
// //       message:
// //         "Diagnostic test created successfully",
// //       data: test,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================= GET ALL TESTS =================

// // const getAllDiagnosticTests = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const tests =
// //       await DiagnosticTest.find().sort({
// //         createdAt: -1,
// //       });

// //     res.status(200).json({
// //       success: true,
// //       count: tests.length,
// //       data: tests,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================= GET SINGLE TEST =================

// // const getSingleDiagnosticTest = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const test = await DiagnosticTest.findById(
// //       req.params.id
// //     );

// //     if (!test) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Diagnostic test not found",
// //       });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       data: test,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================= UPDATE TEST =================

// // const updateDiagnosticTest = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const test = await DiagnosticTest.findById(
// //       req.params.id
// //     );

// //     if (!test) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Diagnostic test not found",
// //       });
// //     }

// //     const updatedTest =
// //       await DiagnosticTest.findByIdAndUpdate(
// //         req.params.id,
// //         req.body,
// //         {
// //           new: true,
// //         }
// //       );

// //     res.status(200).json({
// //       success: true,
// //       message:
// //         "Diagnostic test updated successfully",
// //       data: updatedTest,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // // ================= DELETE TEST =================

// // const deleteDiagnosticTest = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const test = await DiagnosticTest.findById(
// //       req.params.id
// //     );

// //     if (!test) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Diagnostic test not found",
// //       });
// //     }

// //     await DiagnosticTest.findByIdAndDelete(
// //       req.params.id
// //     );

// //     res.status(200).json({
// //       success: true,
// //       message:
// //         "Diagnostic test deleted successfully",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// // module.exports = {
// //   createDiagnosticTest,
// //   getAllDiagnosticTests,
// //   getSingleDiagnosticTest,
// //   updateDiagnosticTest,
// //   deleteDiagnosticTest,
// // };



// // // const LabTest =
// // //   require("../models/LabTestModel");



// // // // ================= CREATE TEST =================

// // // const createDiagnosticTest =
// // //   async (req, res) => {

// // //     try {

// // //       const {

// // //         title,
// // //         shortDescription,
// // //         description,

// // //         category,
// // //         checkupType,

// // //         actualPrice,
// // //         salePrice,

// // //         reportTime,
// // //         totalTests,

// // //         recommended,
// // //         bestSeller,

// // //         homeSample,
// // //         digitalReport,
// // //         nablCertified,

// // //         guidelines,
// // //         parameters,

// // //         image,

// // //       } = req.body;



// // //       // ================= VALIDATION =================

// // //       if (
// // //         !title ||
// // //         !category ||
// // //         !checkupType ||
// // //         !actualPrice ||
// // //         !salePrice
// // //       ) {

// // //         return res.status(400).json({

// // //           success: false,

// // //           message:
// // //             "Required fields missing",

// // //         });

// // //       }



// // //       // ================= CREATE =================

// // //       const test =
// // //         await LabTest.create({

// // //           title,

// // //           shortDescription,

// // //           description,

// // //           category,

// // //           checkupType,

// // //           actualPrice,

// // //           salePrice,

// // //           reportTime,

// // //           totalTests,

// // //           recommended,

// // //           bestSeller,

// // //           homeSample,

// // //           digitalReport,

// // //           nablCertified,

// // //           guidelines,

// // //           parameters,

// // //           image,

// // //         });



// // //       res.status(201).json({

// // //         success: true,

// // //         message:
// // //           "Test created successfully",

// // //         data: test,

// // //       });

// // //     } catch (error) {

// // //       res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message,

// // //       });

// // //     }

// // // };



// // // // ================= GET ALL TESTS =================

// // // const getAllDiagnosticTests =
// // //   async (req, res) => {

// // //     try {

// // //       const tests =
// // //         await LabTest.find()

// // //           .populate("category")
// // //           .populate("checkupType")

// // //           .sort({
// // //             createdAt: -1,
// // //           });



// // //       res.status(200).json({

// // //         success: true,

// // //         count: tests.length,

// // //         data: tests,

// // //       });

// // //     } catch (error) {

// // //       res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message,

// // //       });

// // //     }

// // // };



// // // // ================= GET SINGLE TEST =================

// // // const getSingleDiagnosticTest =
// // //   async (req, res) => {

// // //     try {

// // //       const test =
// // //         await LabTest.findById(
// // //           req.params.id
// // //         )

// // //           .populate("category")
// // //           .populate("checkupType");



// // //       if (!test) {

// // //         return res.status(404).json({

// // //           success: false,

// // //           message:
// // //             "Test not found",

// // //         });

// // //       }



// // //       res.status(200).json({

// // //         success: true,

// // //         data: test,

// // //       });

// // //     } catch (error) {

// // //       res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message,

// // //       });

// // //     }

// // // };



// // // // ================= UPDATE TEST =================

// // // const updateDiagnosticTest =
// // //   async (req, res) => {

// // //     try {

// // //       const updatedTest =
// // //         await LabTest.findByIdAndUpdate(

// // //           req.params.id,

// // //           req.body,

// // //           {
// // //             new: true,
// // //           }

// // //         );



// // //       if (!updatedTest) {

// // //         return res.status(404).json({

// // //           success: false,

// // //           message:
// // //             "Test not found",

// // //         });

// // //       }



// // //       res.status(200).json({

// // //         success: true,

// // //         message:
// // //           "Test updated successfully",

// // //         data: updatedTest,

// // //       });

// // //     } catch (error) {

// // //       res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message,

// // //       });

// // //     }

// // // };



// // // // ================= DELETE TEST =================

// // // const deleteDiagnosticTest =
// // //   async (req, res) => {

// // //     try {

// // //       const deleted =
// // //         await LabTest.findByIdAndDelete(
// // //           req.params.id
// // //         );



// // //       if (!deleted) {

// // //         return res.status(404).json({

// // //           success: false,

// // //           message:
// // //             "Test not found",

// // //         });

// // //       }



// // //       res.status(200).json({

// // //         success: true,

// // //         message:
// // //           "Test deleted successfully",

// // //       });

// // //     } catch (error) {

// // //       res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message,

// // //       });

// // //     }

// // // };



// // // // ================= EXPORTS =================

// // // module.exports = {

// // //   createDiagnosticTest,

// // //   getAllDiagnosticTests,

// // //   getSingleDiagnosticTest,

// // //   updateDiagnosticTest,

// // //   deleteDiagnosticTest,

// // // };


// const LabTest =
//   require("../models/LabTestModel");



// // ================= CREATE TEST =================

// const createDiagnosticTest =
//   async (req, res) => {

//     try {

//       const {

//         title,
//         shortDescription,
//         description,

//         category,
//         checkupType,

//         actualPrice,
//         salePrice,

//         reportTime,
//         totalTests,

//         recommended,
//         bestSeller,

//         homeSample,
//         digitalReport,
//         nablCertified,

//         guidelines,
//         parameters,

//         image,

//       } = req.body;



//       // VALIDATION

//       if (
//         !title ||
//         !category ||
//         !checkupType ||
//         !actualPrice ||
//         !salePrice
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Required fields missing",

//         });

//       }



//       // CREATE

//       const test =
//         await LabTest.create({

//           title,

//           shortDescription,

//           description,

//           category,

//           checkupType,

//           actualPrice,

//           salePrice,

//           reportTime,

//           totalTests,

//           recommended,

//           bestSeller,

//           homeSample,

//           digitalReport,

//           nablCertified,

//           guidelines,

//           parameters,

//           image,

//         });



//       res.status(201).json({

//         success: true,

//         message:
//           "Test created successfully",

//         data: test,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };



// // ================= GET ALL TESTS WITH FILTER =================

// const getAllDiagnosticTests =
//   async (req, res) => {

//     try {

//       const {

//         category,
//         checkupType,

//         recommended,
//         bestSeller,

//         minPrice,
//         maxPrice,

//         search,

//         page = 1,
//         limit = 10,

//       } = req.query;



//       // ================= FILTER OBJECT =================

//       let filter = {};



//       // CATEGORY FILTER
//       if (category) {
//         filter.category = category;
//       }



//       // CHECKUP TYPE FILTER
//       if (checkupType) {
//         filter.checkupType =
//           checkupType;
//       }



//       // RECOMMENDED FILTER
//       if (
//         recommended === "true"
//       ) {

//         filter.recommended =
//           true;

//       }



//       // BEST SELLER FILTER
//       if (
//         bestSeller === "true"
//       ) {

//         filter.bestSeller =
//           true;

//       }



//       // PRICE FILTER
//       if (
//         minPrice ||
//         maxPrice
//       ) {

//         filter.salePrice = {};

//         if (minPrice) {
//           filter.salePrice.$gte =
//             Number(minPrice);
//         }

//         if (maxPrice) {
//           filter.salePrice.$lte =
//             Number(maxPrice);
//         }

//       }



//       // SEARCH FILTER
//       if (search) {

//         filter.$or = [

//           {
//             title: {
//               $regex: search,
//               $options: "i",
//             },
//           },

//           {
//             description: {
//               $regex: search,
//               $options: "i",
//             },
//           },

//         ];

//       }



//       // PAGINATION

//       const skip =
//         (page - 1) * limit;



//       // FIND DATA

//       const tests =
//         await LabTest.find(filter)

//           .populate("category")
//           .populate("checkupType")

//           .sort({
//             createdAt: -1,
//           })

//           .skip(skip)

//           .limit(Number(limit));



//       // TOTAL COUNT

//       const total =
//         await LabTest.countDocuments(
//           filter
//         );



//       res.status(200).json({

//         success: true,

//         total,

//         currentPage:
//           Number(page),

//         totalPages:
//           Math.ceil(
//             total / limit
//           ),

//         data: tests,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };



// // ================= GET SINGLE TEST =================

// const getSingleDiagnosticTest =
//   async (req, res) => {

//     try {

//       const test =
//         await LabTest.findById(
//           req.params.id
//         )

//           .populate("category")
//           .populate("checkupType");



//       if (!test) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Test not found",

//         });

//       }



//       res.status(200).json({

//         success: true,

//         data: test,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };



// // ================= UPDATE TEST =================

// const updateDiagnosticTest =
//   async (req, res) => {

//     try {

//       const updatedTest =
//         await LabTest.findByIdAndUpdate(

//           req.params.id,

//           req.body,

//           {
//             new: true,
//           }

//         );



//       if (!updatedTest) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Test not found",

//         });

//       }



//       res.status(200).json({

//         success: true,

//         message:
//           "Test updated successfully",

//         data: updatedTest,

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };



// // ================= DELETE TEST =================

// const deleteDiagnosticTest =
//   async (req, res) => {

//     try {

//       const deleted =
//         await LabTest.findByIdAndDelete(
//           req.params.id
//         );



//       if (!deleted) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Test not found",

//         });

//       }



//       res.status(200).json({

//         success: true,

//         message:
//           "Test deleted successfully",

//       });

//     } catch (error) {

//       res.status(500).json({

//         success: false,

//         message:
//           error.message,

//       });

//     }

//   };



// // ================= EXPORTS =================

// module.exports = {

//   createDiagnosticTest,

//   getAllDiagnosticTests,

//   getSingleDiagnosticTest,

//   updateDiagnosticTest,

//   deleteDiagnosticTest,

// };



const DiagnosticTest =
  require(
    "../models/DiagnosticTestModel"
  );



// ================= CREATE TEST =================

const createDiagnosticTest =
  async (req, res) => {

    try {

      const {

        name,
        price,
        category,
        description,
        image_url,

      } = req.body;



      // ================= VALIDATION =================

      if (
        !name ||
        !price ||
        !category ||
        !description
      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }



      // ================= CREATE =================

      const newTest =
        await DiagnosticTest.create({

          name,

          price,

          category,

          description,

          image_url,

        });



      res.status(201).json({

        success: true,

        message:
          "Diagnostic test created successfully",

        data: newTest,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ================= GET ALL TESTS =================

const getAllDiagnosticTests =
  async (req, res) => {

    try {

      const {

        category,
        minPrice,
        maxPrice,
        search,

      } = req.query;



      // ================= FILTER =================

      let filter = {};



      // CATEGORY FILTER

      if (category) {

        filter.category =
          category;

      }



      // PRICE FILTER

      if (
        minPrice ||
        maxPrice
      ) {

        filter.price = {};



        if (minPrice) {

          filter.price.$gte =
            Number(minPrice);

        }



        if (maxPrice) {

          filter.price.$lte =
            Number(maxPrice);

        }

      }



      // SEARCH FILTER

      if (search) {

        filter.$or = [

          {
            name: {
              $regex: search,
              $options: "i",
            },
          },

          {
            description: {
              $regex: search,
              $options: "i",
            },
          },

        ];

      }



      // ================= GET DATA =================

      const tests =
        await DiagnosticTest.find(
          filter
        ).sort({
          createdAt: -1,
        });



      res.status(200).json({

        success: true,

        count:
          tests.length,

        data: tests,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ================= GET SINGLE TEST =================

const getSingleDiagnosticTest =
  async (req, res) => {

    try {

      const test =
        await DiagnosticTest.findById(
          req.params.id
        );



      if (!test) {

        return res.status(404).json({

          success: false,

          message:
            "Diagnostic test not found",

        });

      }



      res.status(200).json({

        success: true,

        data: test,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ================= UPDATE TEST =================

const updateDiagnosticTest =
  async (req, res) => {

    try {

      const {

        name,
        price,
        category,
        description,
        image_url,

      } = req.body;



      const updatedTest =
        await DiagnosticTest.findByIdAndUpdate(

          req.params.id,

          {

            name,
            price,
            category,
            description,
            image_url,

          },

          {
            new: true,
          }

        );



      if (!updatedTest) {

        return res.status(404).json({

          success: false,

          message:
            "Diagnostic test not found",

        });

      }



      res.status(200).json({

        success: true,

        message:
          "Diagnostic test updated successfully",

        data: updatedTest,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ================= DELETE TEST =================

const deleteDiagnosticTest =
  async (req, res) => {

    try {

      const deletedTest =
        await DiagnosticTest.findByIdAndDelete(
          req.params.id
        );



      if (!deletedTest) {

        return res.status(404).json({

          success: false,

          message:
            "Diagnostic test not found",

        });

      }



      res.status(200).json({

        success: true,

        message:
          "Diagnostic test deleted successfully",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



module.exports = {

  createDiagnosticTest,

  getAllDiagnosticTests,

  getSingleDiagnosticTest,

  updateDiagnosticTest,

  deleteDiagnosticTest,

};