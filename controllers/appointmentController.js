// controllers/appointmentController.js

const Appointment =
  require("../models/appointmentModel");

/* =========================
   CREATE APPOINTMENT
========================= */

exports.createAppointment =
  async (req, res) => {

    try {

      const {

        date,
        time,
        type,
        patientName,
        patientPhone,
        age,
        gender,
        reason,
        bloodPressure,
        weight,
        temperature,

      } = req.body;

      /* =========================
         VALIDATION
      ========================= */

      if (

        !date ||
        !time ||
        !patientName ||
        !patientPhone

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Required fields missing",

        });

      }

      /* =========================
         CREATE APPOINTMENT
      ========================= */

      const appointment =
        await Appointment.create({

          receptionId:
            req.user.id,

          date,

          time,

          type,

          patientName,

          patientPhone,

          age,

          gender,

          reason,

          bloodPressure,

          weight,

          temperature,

        });

      /* =========================
         RESPONSE
      ========================= */

const appointmentResponse =
  appointment.toObject();

delete appointmentResponse.status;

delete appointmentResponse.__v;

res.status(201).json({

  success: true,

  message:
    "Appointment created successfully",

  appointment:
    appointmentResponse,

});

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   GET MY APPOINTMENTS
========================= */

exports.getMyAppointments =
  async (req, res) => {

    try {

      const appointments =
  await Appointment.find({

    receptionId:
      req.user.id,

  })

  .select(
    "-status -__v"
  )

  .sort({

    createdAt: -1,

  });

      res.status(200).json({

        success: true,

        total:
          appointments.length,

        appointments,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   GET ALL APPOINTMENTS
========================= */

exports.getAllAppointments =
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({

          receptionId:
            req.user.id,

        }).sort({

          createdAt: -1,

        });

      res.status(200).json({

        success: true,

        total:
          appointments.length,

        appointments,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   GET SINGLE APPOINTMENT
========================= */

exports.getSingleAppointment =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findOne({

          _id:
            req.params.id,

          receptionId:
            req.user.id,

        });

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }

      res.status(200).json({

        success: true,

        appointment,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   UPDATE APPOINTMENT STATUS
========================= */

exports.updateAppointmentStatus =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findOne({

          _id:
            req.params.id,

          receptionId:
            req.user.id,

        });

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }

      appointment.status =
        req.body.status ||
        appointment.status;

      await appointment.save();

      res.status(200).json({

        success: true,

        message:
          "Appointment updated successfully",

        appointment,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   DELETE APPOINTMENT
========================= */

exports.deleteAppointment =
  async (req, res) => {

    try {

      const appointment =
        await Appointment.findOne({

          _id:
            req.params.id,

          receptionId:
            req.user.id,

        });

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }

      await appointment.deleteOne();

      res.status(200).json({

        success: true,

        message:
          "Appointment deleted successfully",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };