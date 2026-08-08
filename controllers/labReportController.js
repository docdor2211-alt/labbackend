const LabReport = require(
  "../models/labReportModel"
);


// ======================================================
// CREATE LAB REPORT
// ======================================================

exports.createLabReport =
  async (req, res) => {

    try {

      const report =
        await LabReport.create(
          req.body
        );

      res.status(201).json({

        success: true,

        message:
          "Lab report created successfully",

        data: report,

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
// GET ALL REPORTS
// ======================================================

exports.getAllLabReports =
  async (req, res) => {

    try {

      const reports =
        await LabReport.find()

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        count:
          reports.length,

        data: reports,

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
// GET SINGLE REPORT
// ======================================================

exports.getSingleLabReport =
  async (req, res) => {

    try {

      const report =
        await LabReport.findById(
          req.params.id
        );

      if (!report) {

        return res.status(404).json({

          success: false,

          message:
            "Report not found",

        });

      }

      res.status(200).json({

        success: true,

        data: report,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};