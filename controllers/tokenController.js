require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateTokenKey = require("../util/generateOTP");

const oneTimeTokens = new Map();
const { SECRET_KEY } = process.env;

const generateToken = async (req, res) => {
  try {
    const tokenKey = await generateTokenKey();
    console.log(tokenKey);
    const token = jwt.sign({ tokenKey }, SECRET_KEY, {
      expiresIn: "40min",
    });
    oneTimeTokens.set(tokenKey, 1);
    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    console.error("Error generating OTP:", err.message);
  }
};

module.exports = {
  generateToken,
  oneTimeTokens,
};
