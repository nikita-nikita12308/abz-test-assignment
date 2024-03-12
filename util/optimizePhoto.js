const sharp = require("sharp");
const tinify = require("tinify");
const cloudinary = require("cloudinary").v2;

tinify.key = process.env.TINYFY_API_KEY;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const optimizePhoto = (photoBuffer, height, width) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resizedBuffer = await sharp(photoBuffer)
        .resize(height, width)
        .toBuffer();

      const source = tinify.fromBuffer(resizedBuffer);
      const tinifiedBuffer = await source.toBuffer();

      const cloudinaryUploadResult = await cloudinary.uploader
        .upload_stream(
          {
            folder: "user-photo",
            public_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
          },
          (error, result) => {
            if (error) {
              console.error("Error uploading photo to Cloudinary:", error);
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        )
        .end(tinifiedBuffer);
    } catch (error) {
      console.error("Error optimizing and uploading photo:", error);
      reject(error);
    }
  });
};

module.exports = optimizePhoto;
