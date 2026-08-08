const axios = require("axios");

const uploadToBunny = async (file, folder = "uploads") => {
  try {
    const fileName = `${Date.now()}-${file.originalname}`;

    const url = `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE}/${folder}/${fileName}`;

    await axios.put(url, file.buffer, {
      headers: {
        AccessKey: process.env.BUNNY_API_KEY,
        "Content-Type": file.mimetype,
      },
    });

    return `${process.env.BUNNY_URL}/${folder}/${fileName}`;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw new Error("Bunny Upload Failed");
  }
};

module.exports = uploadToBunny;