const { body, check, query } = require("express-validator");
const positionModel = require("../models/positions/positionModel");
const sharp = require("sharp");

const isValidPosition = async (value, { req }) => {
  const allPositions = await positionModel.getPositions();
  const result = allPositions.some(
    (position) => position.id === parseInt(value, 10)
  );
  if (!result) {
    throw new Error("Invalid position id.");
  }
  return true;
};

const isValidImage = async (value, { req }) => {
  if (!req.file) {
    throw new Error("Image is required.");
  }
  if (
    !(req.file.mimetype === "image/jpg" || req.file.mimetype === "image/jpeg")
  ) {
    throw new Error("Invalid file type", "Image is invalid.");
  }
  if (req.file.size > 5 * 1024 * 1024) {
    throw new Error("File size exceeds 5 MB", "Image is invalid.");
  }
  const fileBuffer = req.file.buffer;
  const metadata = await sharp(fileBuffer).metadata();
  if (metadata.width < 70 || metadata.height < 70) {
    throw new Error(
      "The user photo should have a resolution of at least 70x70 pixels",
      "Image is invalid."
    );
  }

  return true;
};

const validateUserData = [
  body("name")
    .notEmpty()
    .withMessage("The name field is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("The name must be 2-60 characters."),
  body("email")
    .notEmpty()
    .withMessage("The email field is required.")
    .isEmail()
    .withMessage("The email must be a valid email address."),
  body("phone")
    .notEmpty()
    .withMessage("The phone field is required.")
    .matches(/^\+380\d{9}$/)
    .withMessage("The phone must start with +380 and have 9 digits after."),
  body("position_id")
    .notEmpty()
    .withMessage("The position_id field is required.")
    .isInt()
    .withMessage("Position ID must be an integer.")
    .custom(isValidPosition),
  check("photo").custom(isValidImage),
];

const validateQueryParams = [
  query("page")
    .optional()
    .isInt()
    .withMessage("The page must an integer.")
    .isLength({ min: 1 })
    .withMessage("The page must be at least 1."),
  query("offset")
    .optional()
    .isInt()
    .withMessage("The offset must an integer.")
    .isLength({ min: 0 })
    .withMessage("The offset must be at least 0."),
  query("count")
    .optional()
    .isInt()
    .withMessage("The count must an integer.")
    .isLength({ min: 1, max: 100 })
    .withMessage("The count must be between 1 and 100."),
];

module.exports = { validateUserData, validateQueryParams };
