// controllers/labAdminController.js

const LabBooking = require(
  "../models/labBookingModel"
);

// IMPORT USER MODEL
require("../models/userModel");


// ======================================================
// GET ALL LAB BOOKINGS
// ======================================================

exports.getAllLabBookings =
  async (req, res) => {

    try {

      const bookings =
        await LabBooking.find()

          // USER DETAILS
          .populate({
            path: "user",

            select:
              "fullname email phone role",
          })

          // LATEST FIRST
          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        count:
          bookings.length,

        data: bookings,

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
// CONFIRM / CANCEL BOOKING
// ======================================================

exports.updateLabBookingStatus =
  async (req, res) => {

    try {

      const { status } =
        req.body;

      // VALIDATION
      if (

        status !== "Confirmed" &&

        status !== "Cancelled"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid status",

        });

      }

      // FIND BOOKING
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
        status;

      await booking.save();

      res.status(200).json({

        success: true,

        message:
          `Booking ${status}`,

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