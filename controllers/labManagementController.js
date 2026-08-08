// controllers/labManagementController.js

const LabBooking = require(
  "../models/labBookingModel"
);

// IMPORT USER MODEL
const User = require(
  "../models/userModel"
);


// ======================================================
// GET ALL PATIENT BOOKINGS
// ======================================================

const getAllPatients =
  async (req, res) => {

    try {

      const patients =
        await LabBooking.find()

          // USER DETAILS
          .populate(
            "user",
            "fullname email phone role"
          )

          // LATEST BOOKINGS FIRST
          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        totalPatients:
          patients.length,

        data: patients,

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
// GET SINGLE PATIENT BOOKING
// ======================================================

const getSinglePatient =
  async (req, res) => {

    try {

      const patient =
        await LabBooking.findById(
          req.params.id
        )

        // USER DETAILS
        .populate(
          "user",
          "fullname email phone role"
        );

      // NOT FOUND
      if (!patient) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",

        });

      }

      res.status(200).json({

        success: true,

        data: patient,

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
// UPDATE BOOKING STATUS
// ======================================================

const updateBookingStatus =
  async (req, res) => {

    try {

      const booking =
        await LabBooking.findById(
          req.params.id
        );

      // NOT FOUND
      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",

        });

      }

      // UPDATE STATUS
      booking.status =
        req.body.status;

      await booking.save();

      res.status(200).json({

        success: true,

        message:
          "Status updated successfully",

        data: booking,

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
// UPLOAD REPORT
// ======================================================

const uploadReport =
  async (req, res) => {

    try {

      const booking =
        await LabBooking.findById(
          req.params.id
        );

      // NOT FOUND
      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",

        });

      }

      // SAVE REPORT URL
      booking.reportUrl =
        req.body.reportUrl;

      booking.status =
        "Completed";

      booking.isCompleted =
        true;

      await booking.save();

      res.status(200).json({

        success: true,

        message:
          "Report uploaded successfully",

        data: booking,

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

  getAllPatients,

  getSinglePatient,

  updateBookingStatus,

  uploadReport,

};