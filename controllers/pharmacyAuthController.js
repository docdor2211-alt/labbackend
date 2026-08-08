// controllers/pharmacyAuthController.js

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const PharmacyUser = require(
  "../models/PharmacyUser"
);


// ======================================================
// REGISTER PHARMACY
// ======================================================

const registerPharmacy =
  async (req, res) => {

    try {

      const {

        // BASIC INFO
        name,

        email,

        phone,

        password,


        // PROFILE
        licenseNumber,

        rating,

        totalOrders,

        reliability,


        // STORE PERFORMANCE
        storePerformance,


        // INVENTORY SETTINGS
        inventorySettings,


        // BANK DETAILS
        bankDetails,

      } = req.body;


      // ==================================================
      // VALIDATION
      // ==================================================

      if (

        !name ||

        !email ||

        !phone ||

        !password

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Required fields missing",

        });

      }


      // ==================================================
      // CHECK EXISTING PHARMACY
      // ==================================================

      const existingUser =
        await PharmacyUser.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "Pharmacy already exists",

        });

      }


      // ==================================================
      // HASH PASSWORD
      // ==================================================

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      // ==================================================
      // CREATE PHARMACY
      // ==================================================

      const pharmacy =
        await PharmacyUser.create({

          name,

          email,

          phone,

          password:
            hashedPassword,

          licenseNumber,

          rating,

          totalOrders,

          reliability,

          storePerformance,

          inventorySettings,

          bankDetails,

        });


      // ==================================================
      // GENERATE TOKEN
      // ==================================================

      const token = jwt.sign(

        {

          id: pharmacy._id,

          role: "pharmacy",

        },

        process.env.JWT_SECRET,

        {

          expiresIn: "30d",

        }

      );


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(201).json({

        success: true,

        message:
          "Pharmacy registered successfully",

        token,

        pharmacy,

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
// LOGIN PHARMACY
// ======================================================

const loginPharmacy =
  async (req, res) => {

    try {

      const {

        email,

        password,

      } = req.body;


      // ==================================================
      // VALIDATION
      // ==================================================

      if (

        !email ||

        !password

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email and password required",

        });

      }


      // ==================================================
      // FIND PHARMACY
      // ==================================================

      const pharmacy =
        await PharmacyUser.findOne({
          email,
        });

      if (!pharmacy) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid credentials",

        });

      }


      // ==================================================
      // CHECK PASSWORD
      // ==================================================

      const isMatch =
        await bcrypt.compare(
          password,
          pharmacy.password
        );

      if (!isMatch) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid credentials",

        });

      }


      // ==================================================
      // GENERATE TOKEN
      // ==================================================

      const token = jwt.sign(

        {

          id: pharmacy._id,

          role: "pharmacy",

        },

        process.env.JWT_SECRET,

        {

          expiresIn: "30d",

        }

      );


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json({

        success: true,

        message:
          "Pharmacy login successful",

        token,

        pharmacy,

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
// GET ALL PHARMACIES
// ======================================================

const getAllPharmacies =
  async (req, res) => {

    try {

      const pharmacies =
        await PharmacyUser.find()

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        totalPharmacies:
          pharmacies.length,

        data: pharmacies,

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
// GET SINGLE PHARMACY PROFILE
// ======================================================

const getPharmacyProfile =
  async (req, res) => {

    try {

      const pharmacy =
        await PharmacyUser.findById(
          req.params.id
        );

      if (!pharmacy) {

        return res.status(404).json({

          success: false,

          message:
            "Pharmacy not found",

        });

      }

      res.status(200).json({

        success: true,

        data: pharmacy,

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

  registerPharmacy,

  loginPharmacy,

  getAllPharmacies,

  getPharmacyProfile,

};