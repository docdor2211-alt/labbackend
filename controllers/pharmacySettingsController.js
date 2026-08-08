const PharmacySettings = require(
  "../models/pharmacySettingsModel"
);


// ======================================================
// CREATE / UPDATE SETTINGS
// ======================================================

const saveSettings =
  async (req, res) => {

    try {

      const {

        isOnline,

        openingTime,

        closingTime,

      } = req.body;


      // ================================================
      // FIND SETTINGS
      // ================================================

      let settings =
        await PharmacySettings.findOne({

          pharmacy:
            req.user.id,

        });


      // ================================================
      // UPDATE SETTINGS
      // ================================================

      if (settings) {

        settings.isOnline =
          isOnline;

        settings.openingTime =
          openingTime;

        settings.closingTime =
          closingTime;

        await settings.save();

      }

      // ================================================
      // CREATE SETTINGS
      // ================================================

      else {

        settings =
          await PharmacySettings.create({

            pharmacy:
              req.user.id,

            isOnline,

            openingTime,

            closingTime,

          });

      }


      // ================================================
      // RESPONSE
      // ================================================

      res.status(200).json({

        success: true,

        message:
          "Settings saved successfully",

        data: settings,

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
// GET SETTINGS
// ======================================================

const getSettings =
  async (req, res) => {

    try {

      const settings =
        await PharmacySettings.findOne({

          pharmacy:
            req.user.id,

        });

      res.status(200).json({

        success: true,

        data: settings,

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

  saveSettings,

  getSettings,

};