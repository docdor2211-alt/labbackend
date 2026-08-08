

// const MedicineItem = require(
//   "../models/medicineItem.model"
// );



// // ============================================
// // ✅ CREATE MEDICINE
// // ============================================
// exports.createMedicine =
//   async (req, res) => {
//     try {

     
      
// const {
//   medicineSubCategory,
//   name,
//   description,
//   price
// } = req.body;


// // ✅ VALIDATION
// if (
//   !medicineSubCategory ||
//   !name ||
//   !price
// ) {
//   return res.status(400).json({
//     success: false,
//     message:
//       "medicineSubCategory, name & price required"
//   });
// }



//       let imageData = null;

//       // ============================================
//       // ✅ IMAGE FROM FILE
//       // ============================================
//       if (
//         req.files &&
//         req.files.image &&
//         req.files.image.length > 0
//       ) {

//         const uploadRes =
//           await uploadFile(
//             req.files.image[0]
//           );

//         imageData = {
//           url: uploadRes.url,
//           publicId: uploadRes.publicId
//         };
//       }

//       // ============================================
//       // ✅ IMAGE FROM JSON
//       // ============================================
//       else if (req.body.image) {

//         let img = req.body.image;

//         if (typeof img === "string") {
//           try {
//             img = JSON.parse(img);
//           } catch (e) {}
//         }

//         if (
//           img?.url &&
//           img?.publicId
//         ) {
//           imageData = img;
//         }
//       }

//       // ✅ IMAGE REQUIRED
// if (!imageData) {

//   imageData = {
//     url: "",
//     publicId: ""
//   };

// }



//       // ============================================
//       // ✅ CREATE
//       // ============================================
//       const data =
//         await MedicineItem.create({
//          medicineSubCategory,
//           name,
//           description:
//             description || "",
//           price,
//           image: imageData
//         });

//       res.status(201).json({
//         success: true,
//         message:
//           "Medicine created successfully",
//         data
//       });

//     } catch (err) {

//       console.error(
//         "CREATE MEDICINE ERROR:",
//         err
//       );

//       res.status(500).json({
//         success: false,
//         message: err.message
//       });
//     }
//   };



// // ============================================
// // ✅ GET ALL MEDICINES
// // ============================================
// exports.getMedicines =
//   async (req, res) => {
//     try {

//       const page =
//         parseInt(req.query.page) || 1;

//       const limit =
//         parseInt(req.query.limit) || 10;

//       const search =
//         req.query.search || "";

//       const medicineCategory =
//         req.query.medicineCategory || "";

//       const skip =
//         (page - 1) * limit;

//       // ============================================
//       // ✅ FILTER QUERY
//       // ============================================
//       let query = {
//         isActive: true
//       };

//       // ✅ SEARCH
//       if (search) {
//         query.name = {
//           $regex: search,
//           $options: "i"
//         };
//       }

//       // ✅ CATEGORY FILTER
//       if (medicineCategory) {
//         query.medicineCategory =
//           medicineCategory;
//       }

//       // ============================================
//       // ✅ TOTAL
//       // ============================================
//       const total =
//         await MedicineItem.countDocuments(
//           query
//         );

//       // ============================================
//       // ✅ GET DATA
//       // ============================================
//       const medicines =
//         await MedicineItem.find(query)

       
// .populate(
//   "medicineSubCategory",
//   "title"
// )



//           .sort({
//             createdAt: -1
//           })

//           .skip(skip)

//           .limit(limit);

//       res.json({
//         success: true,
//         page,
//         limit,
//         total,
//         data: medicines
//       });

//     } catch (err) {

//       console.error(
//         "GET MEDICINES ERROR:",
//         err
//       );

//       res.status(500).json({
//         success: false,
//         message: err.message
//       });
//     }
//   };



// // ============================================
// // ✅ GET MEDICINES BY SUB CATEGORY
// // ============================================
// exports.getBySubCategory =
//   async (req, res) => {
//     try {

//       const medicines =
      
// await MedicineItem.find({
//   medicineSubCategory:
//     req.params.id,

//   isActive: true
// })



//           .populate(
//             "medicineCategory",
//             "title"
//           )

//           .sort({
//             createdAt: -1
//           });

//       res.json({
//         success: true,
//         count: medicines.length,
//         data: medicines
//       });

//     } catch (err) {

//       console.error(
//         "GET BY SUBCATEGORY ERROR:",
//         err
//       );

//       res.status(500).json({
//         success: false,
//         message: err.message
//       });
//     }
//   };



// // ============================================
// // ✅ GET SINGLE MEDICINE
// // ============================================
// exports.getMedicineById =
//   async (req, res) => {
//     try {

//       const medicine =
//         await MedicineItem.findById(
//           req.params.id
//         )

//           .populate(
//             "medicineCategory",
//             "title"
//           );

//       if (!medicine) {
//         return res.status(404).json({
//           success: false,
//           message:
//             "Medicine not found"
//         });
//       }

//       res.json({
//         success: true,
//         data: medicine
//       });

//     } catch (err) {

//       console.error(
//         "GET MEDICINE ERROR:",
//         err
//       );

//       res.status(500).json({
//         success: false,
//         message: err.message
//       });
//     }
//   };



// // ============================================
// // ✅ UPDATE MEDICINE
// // ============================================
// exports.updateMedicine =
//   async (req, res) => {
//     try {

//       const medicine =
//         await MedicineItem.findById(
//           req.params.id
//         );

//       if (!medicine) {
//         return res.status(404).json({
//           success: false,
//           message:
//             "Medicine not found"
//         });
//       }

//       const {
//         medicineCategory,
//         name,
//         description,
//         price,
//         isActive
//       } = req.body;

//       // ✅ UPDATE FIELDS
//       if (medicineCategory) {
//         medicine.medicineCategory =
//           medicineCategory;
//       }

//       if (name) {
//         medicine.name = name;
//       }

//       if (
//         description !== undefined
//       ) {
//         medicine.description =
//           description;
//       }

//       if (price) {
//         medicine.price = price;
//       }

//       if (
//         isActive !== undefined
//       ) {
//         medicine.isActive =
//           isActive;
//       }

//       // ============================================
//       // ✅ IMAGE UPDATE FROM FILE
//       // ============================================
//       if (
//         req.files?.image?.length > 0
//       ) {

//         // delete old image
//         if (
//           medicine.image?.publicId
//         ) {
//           await deleteFile(
//             medicine.image.publicId
//           );
//         }

//         const uploadRes =
//           await uploadFile(
//             req.files.image[0]
//           );

//         medicine.image = {
//           url: uploadRes.url,
//           publicId:
//             uploadRes.publicId
//         };
//       }

//       // ============================================
//       // ✅ IMAGE UPDATE FROM JSON
//       // ============================================
//       else if (req.body.image) {

//         let img = req.body.image;

//         if (typeof img === "string") {
//           try {
//             img = JSON.parse(img);
//           } catch (e) {}
//         }

//         if (
//           img?.url &&
//           img?.publicId
//         ) {

//           if (
//             medicine.image?.publicId &&
//             medicine.image.publicId !==
//               img.publicId
//           ) {
//             await deleteFile(
//               medicine.image.publicId
//             );
//           }

//           medicine.image = img;
//         }
//       }

//       // ============================================
//       // ✅ SAVE
//       // ============================================
//       await medicine.save();

//       res.json({
//         success: true,
//         message:
//           "Medicine updated successfully",
//         data: medicine
//       });

//     } catch (err) {

//       console.error(
//         "UPDATE MEDICINE ERROR:",
//         err
//       );

//       res.status(500).json({
//         success: false,
//         message: err.message
//       });
//     }
//   };



// // ============================================
// // ✅ DELETE MEDICINE
// // ============================================
// exports.deleteMedicine =
//   async (req, res) => {
//     try {

//       const medicine =
//         await MedicineItem.findById(
//           req.params.id
//         );

//       if (!medicine) {
//         return res.status(404).json({
//           success: false,
//           message:
//             "Medicine not found"
//         });
//       }

//       // ✅ DELETE IMAGE
//       if (
//         medicine.image?.publicId
//       ) {
//         await deleteFile(
//           medicine.image.publicId
//         );
//       }

//       // ✅ DELETE DOCUMENT
//       await medicine.deleteOne();

//       res.json({
//         success: true,
//         message:
//           "Medicine deleted successfully"
//       });

//     } catch (err) {

//       console.error(
//         "DELETE MEDICINE ERROR:",
//         err
//       );

//       res.status(500).json({
//         success: false,
//         message: err.message
//       });
//     }
//   };
const MedicineItem = require("../models/medicineItem.model");
const MedicineSubCategory = require("../models/medicineSubCategory.model");

// ==========================================
// CREATE MEDICINE
// ==========================================
exports.createMedicine = async (req, res) => {
try {


const {
  medicineCategory,
  medicineSubCategory,
  name,
  description,
  price
} = req.body;

console.log("BODY =>", req.body);

if (
  !medicineCategory ||
  !medicineSubCategory ||
  !name ||
  !price
) {
  return res.status(400).json({
    success: false,
    message:
      "medicineCategory, medicineSubCategory, name and price are required"
  });
}

const medicine = await MedicineItem.create({
  medicineCategory: medicineCategory,
  medicineSubCategory: medicineSubCategory,
  name: name,
  description: description || "",
  price: price,
  image: {
    url: "",
    publicId: ""
  }
});

console.log("CREATED =>", medicine);

const data = await MedicineItem.findById(
  medicine._id
)
  .populate(
    "medicineCategory"
  )
  .populate(
    "medicineSubCategory"
  );

return res.status(201).json({
  success: true,
  message:
    "Medicine created successfully",
  data
});


} catch (error) {


console.error(
  "CREATE MEDICINE ERROR =>",
  error
);

return res.status(500).json({
  success: false,
  message: error.message
});


}
};


// ==========================================
// GET ALL MEDICINES
// ==========================================
exports.getMedicines = async (
req,
res
) => {
try {


const page =
  parseInt(req.query.page) || 1;

const limit =
  parseInt(req.query.limit) || 10;

const skip =
  (page - 1) * limit;

const query = {
  isActive: true
};

if (req.query.search) {
  query.name = {
    $regex: req.query.search,
    $options: "i"
  };
}

if (req.query.medicineCategory) {
  query.medicineCategory =
    req.query.medicineCategory;
}

if (req.query.medicineSubCategory) {
  query.medicineSubCategory =
    req.query.medicineSubCategory;
}

const total =
  await MedicineItem.countDocuments(
    query
  );

const data =
  await MedicineItem.find(query)
    .populate(
      "medicineCategory",
      "title"
    )
    .populate(
      "medicineSubCategory",
      "title"
    )
    .sort({
      createdAt: -1
    })
    .skip(skip)
    .limit(limit);

return res.json({
  success: true,
  page,
  limit,
  total,
  data
});


} catch (error) {


return res.status(500).json({
  success: false,
  message: error.message
});


}
};

// ==========================================
// GET BY CATEGORY
// ==========================================
exports.getByCategory = async (
req,
res
) => {
try {


const data =
  await MedicineItem.find({
    medicineCategory:
      req.params.id,
    isActive: true
  })
    .populate(
      "medicineCategory",
      "title"
    )
    .populate(
      "medicineSubCategory",
      "title"
    );

return res.json({
  success: true,
  count: data.length,
  data
});


} catch (error) {


return res.status(500).json({
  success: false,
  message: error.message
});


}
};

// ==========================================
// GET BY SUBCATEGORY
// ==========================================
exports.getBySubCategory =
async (req, res) => {
try {


  const data =
    await MedicineItem.find({
      medicineSubCategory:
        req.params.id,
      isActive: true
    })
      .populate(
        "medicineCategory",
        "title"
      )
      .populate(
        "medicineSubCategory",
        "title"
      );

  return res.json({
    success: true,
    count: data.length,
    data
  });

} catch (error) {

  return res.status(500).json({
    success: false,
    message: error.message
  });
}


};

// ==========================================
// GET SINGLE MEDICINE
// ==========================================
exports.getMedicineById =
async (req, res) => {
try {


  const data =
    await MedicineItem.findById(
      req.params.id
    )
      .populate(
        "medicineCategory",
        "title"
      )
      .populate(
        "medicineSubCategory",
        "title"
      );

  if (!data) {
    return res.status(404).json({
      success: false,
      message:
        "Medicine not found"
    });
  }

  return res.json({
    success: true,
    data
  });

} catch (error) {

  return res.status(500).json({
    success: false,
    message: error.message
  });
}


};

// ==========================================
// UPDATE MEDICINE
// ==========================================
exports.updateMedicine =
async (req, res) => {
try {


  const updated =
    await MedicineItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate(
        "medicineCategory",
        "title"
      )
      .populate(
        "medicineSubCategory",
        "title"
      );

  return res.json({
    success: true,
    message:
      "Medicine updated successfully",
    data: updated
  });

} catch (error) {

  return res.status(500).json({
    success: false,
    message: error.message
  });
}


};

// ==========================================
// DELETE MEDICINE
// ==========================================
exports.deleteMedicine =
async (req, res) => {
try {


  await MedicineItem.findByIdAndDelete(
    req.params.id
  );

  return res.json({
    success: true,
    message:
      "Medicine deleted successfully"
  });

} catch (error) {

  return res.status(500).json({
    success: false,
    message: error.message
  });
}


};
