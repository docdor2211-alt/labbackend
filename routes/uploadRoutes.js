const express = require("express");

const router = express.Router();

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

const uploadToBunny = require("../config/bunny");

router.post(
  "/image",
  upload.single("image"),
  async (req, res) => {
    try {
      const imageUrl = await uploadToBunny(req.file, "labs");

      res.status(200).json({
        success: true,
        imageUrl,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;