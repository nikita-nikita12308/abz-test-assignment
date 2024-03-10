const express = require("express");
const { param } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");
const checkToken = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");
const {
  validateUserData,
  validateQueryParams,
} = require("../middleware/userValidation");

router.get("/:id", param("id").isInt(), userController.getUserById);
router.get("/", validateQueryParams, userController.getUsers);
router.post(
  "/",
  checkToken,
  upload.single("photo"),
  validateUserData,
  userController.createUser
);

module.exports = router;
