// // routes/petCareProductRoutes.js

// const express =
//   require("express");

// const router =
//   express.Router();

// const {

//   createPetCareProduct,

//   getAllPetCareProducts,

//   getSinglePetCareProduct,

//   updatePetCareProduct,

//   deletePetCareProduct,

// } = require(
//   "../controllers/petCareProductController"
// );



// // CREATE

// router.post(
//   "/create",
//   createPetCareProduct
// );



// // GET ALL

// router.get(
//   "/all",
//   getAllPetCareProducts
// );



// // GET SINGLE

// router.get(
//   "/:id",
//   getSinglePetCareProduct
// );



// // UPDATE

// router.put(
//   "/update/:id",
//   updatePetCareProduct
// );



// // DELETE

// router.delete(
//   "/delete/:id",
//   deletePetCareProduct
// );

// module.exports =
//   router;



const express =
  require("express");

const router =
  express.Router();

const {

  createPetCareProduct,

  getAllPetCareProducts,

  getSinglePetCareProduct,

  updatePetCareProduct,

  deletePetCareProduct,

} = require(
  "../controllers/petCareProductController"
);

const {

  protect,

  pharmacyOnly,

} = require(
  "../middleware/authMiddleware"
);



// CREATE
router.post(
  "/create",
  protect,
  pharmacyOnly,
  createPetCareProduct
);



// GET ALL
router.get(
  "/all",
  protect,
  pharmacyOnly,
  getAllPetCareProducts
);



// GET SINGLE
router.get(
  "/:id",
  protect,
  pharmacyOnly,
  getSinglePetCareProduct 
);



// UPDATE
router.put(
  "/update/:id",
  protect,
  pharmacyOnly,
  updatePetCareProduct
);



// DELETE
router.delete(
  "/delete/:id",
  protect,
  pharmacyOnly,
  deletePetCareProduct 
);



module.exports =
  router;