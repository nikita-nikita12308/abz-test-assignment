const sharp = require("sharp");
const tinify = require("tinify");
tinify.key = process.env.TINYFY_API_KEY;

const optimizePhoto = async (photoBuffer, height, width) => {
  try {
    const resizedBuffer = await sharp(photoBuffer)
      .resize(height, width)
      .toBuffer();
    const source = tinify.fromBuffer(resizedBuffer);
    const outputPath = `user-photo/${
      Date.now() + "-" + Math.round(Math.random() * 1e9)
    }.jpg`;
    source.toFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error("Error optimizing and saving photo:", error);
    throw error;
  }
};

module.exports = optimizePhoto;
