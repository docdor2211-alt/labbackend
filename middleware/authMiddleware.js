// // middleware/authMiddleware.js

// const jwt = require("jsonwebtoken");


// // ==========================================
// // PROTECT MIDDLEWARE
// // ==========================================

// const protect = async (
//   req,
//   res,
//   next
// ) => {

//   try {

//     let token;

//     // =====================================
//     // GET TOKEN
//     // =====================================

//     if (

//       req.headers.authorization &&

//       req.headers.authorization.startsWith(
//         "Bearer"
//       )

//     ) {

//       token =
//         req.headers.authorization.split(
//           " "
//         )[1];

//     }


//     // =====================================
//     // TOKEN NOT FOUND
//     // =====================================

//     if (!token) {

//       return res.status(401).json({

//         success: false,

//         message:
//           "Token not found",

//       });

//     }


//     // =====================================
//     // VERIFY TOKEN
//     // =====================================

//     const decoded =
//       jwt.verify(

//         token,

//         process.env.JWT_SECRET

//       );


//     // =====================================
//     // SAVE USER DATA
//     // =====================================

//     req.user = decoded;

//     next();

//   } catch (error) {

//     return res.status(401).json({

//       success: false,

//       message:
//         "Invalid token",

//     });

//   }

// };


// // ==========================================
// // USER ONLY
// // ==========================================

// const userOnly = (
//   req,
//   res,
//   next
// ) => {

//   if (
//     req.user.role !== "user"
//   ) {

//     return res.status(403).json({

//       success: false,

//       message:
//         "User access only",

//     });

//   }

//   next();

// };


// // ==========================================
// // DOCTOR ONLY
// // ==========================================

// const doctorOnly = (
//   req,
//   res,
//   next
// ) => {

//   if (
//     req.user.role !== "doctor"
//   ) {

//     return res.status(403).json({

//       success: false,

//       message:
//         "Doctor access only",

//     });

//   }

//   next();

// };
// // ==========================================
// // RECEPTION ONLY
// // ==========================================

// const receptionOnly = (
//   req,
//   res,
//   next
// ) => {

//   if (
//     req.user.role !==
//     "reception"
//   ) {

//     return res.status(403).json({

//       success: false,

//       message:
//         "Reception access only",

//     });

//   }

//   next();

// };


// // ==========================================
// // LABORATORY ONLY
// // ==========================================

// const laboratoryOnly = (
//   req,
//   res,
//   next
// ) => {

//   if (
//     req.user.role !==
//     "laboratory"
//   ) {

//     return res.status(403).json({

//       success: false,

//       message:
//         "Laboratory access only",

//     });

//   }

//   next();

// };


// // ==========================================
// // PHARMACY ONLY
// // ==========================================

// const pharmacyOnly = (
//   req,
//   res,
//   next
// ) => {

//   if (
//     req.user.role !==
//     "pharmacy"
//   ) {

//     return res.status(403).json({

//       success: false,

//       message:
//         "Pharmacy access only",

//     });

//   }

//   next();

// };


// // ==========================================
// // ADMIN ONLY
// // ==========================================

// const adminOnly = (
//   req,
//   res,
//   next
// ) => {

//   if (
//     req.user.role !== "admin"
//   ) {

//     return res.status(403).json({

//       success: false,

//       message:
//         "Admin access only",

//     });

//   }

//   next();

// };


// // ==========================================
// // EXPORTS
// // ==========================================

// module.exports = {

//   protect,

//   userOnly,

//   doctorOnly,

//   laboratoryOnly,

//   pharmacyOnly,

//   adminOnly,
//     receptionOnly,

// };


// middleware/authMiddleware.js

const jwt =
  require("jsonwebtoken");

/* ==========================================
   PROTECT MIDDLEWARE
========================================== */

const protect =
  async (
    req,
    res,
    next
  ) => {

    try {

      let token;

      /* =====================================
         GET TOKEN
      ===================================== */

      if (

        req.headers.authorization &&

        req.headers.authorization.startsWith(
          "Bearer"
        )

      ) {

        token =
          req.headers.authorization.split(
            " "
          )[1];

      }

      /* =====================================
         TOKEN NOT FOUND
      ===================================== */

      if (!token) {

        return res.status(401).json({

          success: false,

          message:
            "Token not found",

        });

      }

      /* =====================================
         VERIFY TOKEN
      ===================================== */

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );

      /* =====================================
         SAVE USER DATA
      ===================================== */

      req.user =
        decoded;

      next();

    } catch (error) {

      console.log(error);

      return res.status(401).json({

        success: false,

        message:
          "Invalid token",

      });

    }

  };

/* ==========================================
   USER ONLY
========================================== */

const userOnly =
  (
    req,
    res,
    next
  ) => {

    if (
      req.user.role !==
      "user"
    ) {

      return res.status(403).json({

        success: false,

        message:
          "User access only",

      });

    }

    next();

  };

/* ==========================================
   DOCTOR ONLY
========================================== */

const doctorOnly =
  (
    req,
    res,
    next
  ) => {

    if (
      req.user.role !==
      "doctor"
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Doctor access only",

      });

    }

    next();

  };

/* ==========================================
   RECEPTION ONLY
========================================== */

const receptionOnly =
  (
    req,
    res,
    next
  ) => {

    if (
      req.user.role !==
      "reception"
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Reception access only",

      });

    }

    next();

  };

/* ==========================================
   LABORATORY ONLY
========================================== */

const laboratoryOnly =
  (
    req,
    res,
    next
  ) => {

    if (
      req.user.role !==
      "laboratory"
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Laboratory access only",

      });

    }

    next();

  };

/* ==========================================
   PHARMACY ONLY
========================================== */

const pharmacyOnly =
  (
    req,
    res,
    next
  ) => {

    if (
      req.user.role !==
      "pharmacy"
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Pharmacy access only",

      });

    }

    next();

  };

/* ==========================================
   ADMIN ONLY
========================================== */

const adminOnly =
  (
    req,
    res,
    next
  ) => {

    if (
      req.user.role !==
      "admin"
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Admin access only",

      });

    }

    next();

  };

/* ==========================================
   EXPORTS
========================================== */

module.exports = {

  protect,

  userOnly,

  doctorOnly,

  receptionOnly,

  laboratoryOnly,

  pharmacyOnly,

  adminOnly,

};