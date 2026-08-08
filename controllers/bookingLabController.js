// controllers/bookingLabController.js

const LabBooking = require(
  "../models/labBookingModel"
);


// ======================================================
// GET ALL BOOKINGS
// ======================================================

const getAllBookings =
  async (req, res) => {

    try {

      const bookings =
        await LabBooking.find()

          .populate(
            "user",
            "fullName email phone"
          )

          .sort({
            createdAt: -1,
          });


      res.status(200).json({

        success: true,

        totalBookings:
          bookings.length,

        data: bookings,

      });

    } catch (error) {

      console.log(
        "Get All Bookings Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};
const getAllBookingsForRider =
async (req, res) => {
try {
const bookings =
await LabBooking.find()
.populate(
"user",
"fullName email phone"
)
.sort({
createdAt: -1,
});


  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
} catch (error) {
  console.log(
    "Get All Bookings For Rider Error:",
    error
  );

  res.status(500).json({
    success: false,
    message: error.message,
  });
}


};


// ======================================================
// GET SINGLE BOOKING
// ======================================================

const getSingleBooking =
  async (req, res) => {

    try {

      const booking =
        await LabBooking.findById(
          req.params.id
        )

        .populate(
          "user",
          "fullName email phone"
        );


      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",

        });

      }


      res.status(200).json({

        success: true,

        data: booking,

      });

    } catch (error) {

      console.log(
        "Get Single Booking Error:",
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
// ACCEPT BOOKING
// ======================================================

const acceptBooking =
  async (req, res) => {

    try {

      const booking =
        await LabBooking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",

        });

      }


      booking.status =
        "Confirmed";

      await booking.save();


      res.status(200).json({

        success: true,

        message:
          "Booking accepted successfully",

        data: booking,

      });

    } catch (error) {

      console.log(
        "Accept Booking Error:",
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
// REJECT BOOKING
// ======================================================

const rejectBooking =
  async (req, res) => {

    try {

      const booking =
        await LabBooking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",

        });

      }


      booking.status =
        "Cancelled";

      await booking.save();


      res.status(200).json({

        success: true,

        message:
          "Booking rejected successfully",

        data: booking,

      });

    } catch (error) {

      console.log(
        "Reject Booking Error:",
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
// COMPLETE BOOKING
// ======================================================

const completeBooking =
  async (req, res) => {

    try {

      const booking =
        await LabBooking.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",

        });

      }


      booking.status =
        "Completed";

      booking.isCompleted =
        true;

      booking.reportUrl =
        req.body.reportUrl || "";

      await booking.save();


      res.status(200).json({

        success: true,

        message:
          "Booking completed successfully",

        data: booking,

      });

    } catch (error) {

      console.log(
        "Complete Booking Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};

const riderAcceptBooking = async (req, res) => {
  try {
    const booking = await LabBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Confirmed";

    if (req.body.riderId) {
      booking.riderId = req.body.riderId;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      data: booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const riderRejectBooking = async (req, res) => {
  try {
    const booking = await LabBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      data: booking,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  getAllBookings,
  getAllBookingsForRider,

  getSingleBooking,

  acceptBooking,

  rejectBooking,

  completeBooking,
   riderAcceptBooking,
  riderRejectBooking,

};