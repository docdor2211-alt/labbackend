const PharmacySchedule = require(
  "../models/pharmacyScheduleModel"
);


// ======================================================
// CREATE SCHEDULE
// ======================================================

const createSchedule =
  async (req, res) => {

    try {

      const schedule =
        await PharmacySchedule.create({

          pharmacy:
            req.user.id,

          day:
            req.body.day,

          isOpen:
            req.body.isOpen,

          openingTime:
            req.body.openingTime,

          closingTime:
            req.body.closingTime,

          isHoliday:
            req.body.isHoliday,

          holidayTitle:
            req.body.holidayTitle,

          holidayDate:
            req.body.holidayDate,

        });

      res.status(201).json({

        success: true,

        message:
          "Schedule created successfully",

        data: schedule,

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
// GET LOGIN PHARMACY SCHEDULE
// ======================================================

const getSchedules =
  async (req, res) => {

    try {

      const schedules =
        await PharmacySchedule.find({

          pharmacy:
            req.user.id,

        })

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        total:
          schedules.length,

        data: schedules,

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
// UPDATE SCHEDULE
// ======================================================

const updateSchedule =
  async (req, res) => {

    try {

      const schedule =
        await PharmacySchedule.findOneAndUpdate(

          {

            _id:
              req.params.id,

            pharmacy:
              req.user.id,

          },

          req.body,

          {

            new: true,

          }

        );

      if (!schedule) {

        return res.status(404).json({

          success: false,

          message:
            "Schedule not found",

        });

      }

      res.status(200).json({

        success: true,

        message:
          "Schedule updated successfully",

        data: schedule,

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
// DELETE SCHEDULE
// ======================================================

const deleteSchedule =
  async (req, res) => {

    try {

      const schedule =
        await PharmacySchedule.findOneAndDelete({

          _id:
            req.params.id,

          pharmacy:
            req.user.id,

        });

      if (!schedule) {

        return res.status(404).json({

          success: false,

          message:
            "Schedule not found",

        });

      }

      res.status(200).json({

        success: true,

        message:
          "Schedule deleted successfully",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};

module.exports = {

  createSchedule,

  getSchedules,

  updateSchedule,

  deleteSchedule,

};