const userModel = require("../models/users/userModel");
const optimizePhoto = require("../util/optimizePhoto");
const { validationResult } = require("express-validator");

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        fails: Object.fromEntries(
          Object.entries(errors.mapped()).map(([field, error]) => [
            field,
            [error.msg],
          ])
        ),
      });
    }
    const { name, email, phone, position_id } = req.body;
    const user = await userModel.findUserByEmailOrPhone(email, phone);
    if (user.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User with this phone or email already exist",
      });
    }
    const optimizedPhotoPath = await optimizePhoto(req.file.buffer, 70, 70);
    const createdUserId = await userModel.createUser(
      name,
      email,
      phone,
      position_id,
      optimizedPhotoPath
    );

    res.status(200).json({
      success: true,
      user_id: createdUserId,
      message: "New user successfully registered",
    });
  } catch (err) {
    console.error("Error in user registration:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        fails: {
          user_id: ["The user_id must be an integer."],
        },
      });
    }
    const user = await userModel.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "The user with the requested identifier does not exist",
        fails: {
          user_id: ["User not found"],
        },
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error in getUserById:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      fails: Object.fromEntries(
        Object.entries(errors.mapped()).map(([field, error]) => [
          field,
          [error.msg],
        ])
      ),
    });
  }

  const { page = 1, count = 5, offset } = req.query;

  const total_users = await userModel.getUsersCount();
  const total_pages = Math.ceil(total_users / count);

  let currentPage;

  if (page > total_pages) {
    currentPage = total_pages;
  } else {
    currentPage = Math.floor(offset / count) + 1 || page;
  }

  const skip = count * (currentPage - 1);

  const next_url = `${req.protocol}://${req.get("host")}/api/v1/users?page=${
    currentPage - 1
  }&count=${count}`;
  const prev_url = `${req.protocol}://${req.get("host")}/api/v1/users?page=${
    currentPage + 1
  }&count=${count}`;

  const links = {
    next_url: currentPage < total_pages ? next_url : null,
    prev_url: currentPage > 1 ? prev_url : null,
  };

  const users = await userModel.getUsers(count, skip);

  res.status(200).json({
    success: true,
    page: parseInt(currentPage),
    total_pages,
    total_users,
    count: parseInt(count),
    links,
    users,
  });
};

module.exports = { createUser, getUsers, getUserById };
