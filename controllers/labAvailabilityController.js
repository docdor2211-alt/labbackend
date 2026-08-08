// controllers/labAvailabilityController.js

const LabAvailability = require(
  "../models/labAvailabilityModel"
);


// ======================================================
// CREATE OR UPDATE LAB AVAILABILITY
// ======================================================

const updateLabAvailability =
  async (req, res) => {

    try {

      // ==========================================
      // ROLE CHECK
      // ==========================================

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


      // ==========================================
      // LOGIN LAB ID
      // ==========================================

      const laboratoryId =
        req.user.id;


      // ==========================================
      // BODY DATA
      // ==========================================

      const {
        is_online,
      } = req.body;


      // ==========================================
      // VALIDATION
      // ==========================================

      if (
        typeof is_online !==
        "boolean"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "is_online must be true or false",

        });

      }


      // ==========================================
      // FIND EXISTING
      // ==========================================

      let availability =
        await LabAvailability.findOne({

          laboratoryId,

        });


      // ==========================================
      // UPDATE
      // ==========================================

      if (availability) {

        availability.is_online =
          is_online;

        await availability.save();

        return res.status(200).json({

          success: true,

          message:
            "Lab availability updated successfully",

          data: availability,

        });

      }


      // ==========================================
      // CREATE
      // ==========================================

      availability =
        await LabAvailability.create({

          laboratoryId,

          is_online,

        });


      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(201).json({

        success: true,

        message:
          "Lab availability created successfully",

        data: availability,

      });

    } catch (error) {

      console.log(
        "Update Availability Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};


// ======================================================
// GET LAB AVAILABILITY
// ======================================================

const getLabAvailability =
  async (req, res) => {

    try {

      // ==========================================
      // ROLE CHECK
      // ==========================================

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


      // ==========================================
      // LOGIN LAB ID
      // ==========================================

      const laboratoryId =
        req.user.id;


      // ==========================================
      // FIND AVAILABILITY
      // ==========================================

      const availability =
        await LabAvailability.findOne({

          laboratoryId,

        });


      // ==========================================
      // NOT FOUND
      // ==========================================

      if (!availability) {

        return res.status(404).json({

          success: false,

          message:
            "Lab availability not found",

        });

      }


      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        data: availability,

      });

    } catch (error) {

      console.log(
        "Get Availability Error:",
        error
      );

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

  updateLabAvailability,

  getLabAvailability,

};