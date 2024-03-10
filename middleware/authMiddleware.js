require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const tokenController = require("../controllers/tokenController");

const checkToken = (req, res, next) => {
  const token = req.header("Token");
  console.log(token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "The token expired.",
    });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "The token expired.",
      });
    }

    const tokenKey = decoded ? decoded.tokenKey : null;
    console.log(tokenController.oneTimeTokens.get(tokenKey));
    if (tokenKey && tokenController.oneTimeTokens.get(tokenKey)) {
      tokenController.oneTimeTokens.delete(tokenKey);
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "The token expired.",
      });
    }
  });
};

module.exports = checkToken;
