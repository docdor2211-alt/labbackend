const Schedule = require(
  "../models/scheduleModel"
);


// ======================================================
// CREATE SCHEDULE
// ======================================================

exports.createSchedule =
  async (req, res) => {

    try {

      const {

        day,

        isOpen,

        openingTime,

        closingTime,

        isHoliday,

        holidayTitle,

        holidayDate,

      } = req.body;


      const schedule =
        await Schedule.create({

          day,

          isOpen,

          openingTime,

          closingTime,

          isHoliday,

          holidayTitle,

          holidayDate,

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
// GET ALL SCHEDULES
// ======================================================

exports.getAllSchedules =
  async (req, res) => {

    try {

      const schedules =
        await Schedule.find()

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        totalSchedules:
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
// GET SINGLE SCHEDULE
// ======================================================

exports.getSingleSchedule =
  async (req, res) => {

    try {

      const schedule =
        await Schedule.findById(
          req.params.id
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
// UPDATE SCHEDULE
// ======================================================

exports.updateSchedule =
  async (req, res) => {

    try {

      const schedule =
        await Schedule.findByIdAndUpdate(

          req.params.id,

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

exports.deleteSchedule =
  async (req, res) => {

    try {

      const schedule =
        await Schedule.findByIdAndDelete(
          req.params.id
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