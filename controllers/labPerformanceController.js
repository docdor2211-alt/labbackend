const LabPerformance = require(
  "../models/labPerformanceModel"
);


// ======================================================
// CREATE LAB PERFORMANCE
// ======================================================

exports.createLabPerformance =
  async (req, res) => {

    try {

      const {

        avg_tat,

        accuracy,

        patient_satisfaction,

        patient_rating,

        top_tests,

      } = req.body;

      const performance =
        await LabPerformance.create({

          avg_tat,

          accuracy,

          patient_satisfaction,

          patient_rating,

          top_tests,

        });

      res.status(201).json({

        success: true,

        message:
          "Lab performance created successfully",

        data: performance,

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
// GET LAB PERFORMANCE
// ======================================================

exports.getLabPerformance =
  async (req, res) => {

    try {

      const performance =
        await LabPerformance.find()

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        count:
          performance.length,

        data: performance,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};