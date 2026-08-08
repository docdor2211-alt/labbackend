// controllers/laboratoryAuthController.js

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const LaboratoryUser =
  require("../models/LaboratoryUser");



// ======================================================
// REGISTER LABORATORY
// ======================================================

const registerLaboratory =
  async (req, res) => {

    try {

      const {

        fullName,
        email,
        phone,
        password,

        doctorName,
        labName,
        labId,
        profileImage,

        labPhone,
        labAddress,
        labWebsite,
        registrationNo,
        labType,
        gstNo,
        workingHours,
        homeSample,
        emergency,
        bannerImage,

        licenses,

      } = req.body;



      // ==========================================
      // VALIDATION
      // ==========================================

      if (
        !fullName ||
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



      // ==========================================
      // CHECK EXISTING LAB
      // ==========================================

      const existingUser =
        await LaboratoryUser.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "Laboratory already exists",

        });

      }



      // ==========================================
      // HASH PASSWORD
      // ==========================================

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );



      // ==========================================
      // CREATE LAB
      // ==========================================

      const user =
        await LaboratoryUser.create({

          fullName,
          email,
          phone,

          password:
            hashedPassword,

          doctorName,
          labName,
          labId,
          profileImage,

          labPhone,
          labAddress,
          labWebsite,
          registrationNo,
          labType,
          gstNo,
          workingHours,
          homeSample,
          emergency,
          bannerImage,

          licenses,

        });



      // ==========================================
      // GENERATE TOKEN
      // ==========================================

      const token = jwt.sign(

        {

          id:
            user._id,

          role:
            "laboratory",

        },

        process.env.JWT_SECRET,

        {

          expiresIn:
            "30d",

        }

      );



      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(201).json({

        success: true,

        message:
          "Laboratory registered successfully",

        token,

        user,

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
// LOGIN LABORATORY
// ======================================================

const loginLaboratory =
  async (req, res) => {

    try {

      const {

        email,
        password,

      } = req.body;



      // ==========================================
      // VALIDATION
      // ==========================================

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



      // ==========================================
      // FIND LAB
      // ==========================================

      const user =
        await LaboratoryUser.findOne({
          email,
        });

      if (!user) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid credentials",

        });

      }



      // ==========================================
      // CHECK PASSWORD
      // ==========================================

      const isMatch =
        await bcrypt.compare(

          password,

          user.password

        );

      if (!isMatch) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid credentials",

        });

      }



      // ==========================================
      // GENERATE TOKEN
      // ==========================================

      const token = jwt.sign(

        {

          id:
            user._id,

          role:
            "laboratory",

        },

        process.env.JWT_SECRET,

        {

          expiresIn:
            "30d",

        }

      );



      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        message:
          "Laboratory login successful",

        token,

        user,

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
// GET LABORATORY PROFILE
// ======================================================

const getLaboratoryProfile =
  async (req, res) => {

    try {

      const user =
        await LaboratoryUser.findById(
          req.user.id
        ).select("-password");



      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "Laboratory not found",

        });

      }



      res.status(200).json({

        success: true,

        message:
          "Laboratory profile fetched successfully",

        user,

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
// GET ALL LABORATORIES
// ======================================================

const getAllLaboratories =
  async (req, res) => {

    try {

      const laboratories =
        await LaboratoryUser.find()
          .select("-password")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        totalLaboratories:
          laboratories.length,

        laboratories,

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

  registerLaboratory,

  loginLaboratory,

  getLaboratoryProfile,
   getAllLaboratories,

};