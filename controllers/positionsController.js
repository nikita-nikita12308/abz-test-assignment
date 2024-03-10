const positionModel = require("../models/positions/positionModel");

const getPositions = async (req, res) => {
  try {
    const positions = await positionModel.getPositions();
    if (positions.length === 0) {
      return res.status(422).json({
        success: false,
        message: "Positions not found",
      });
    }
    res.status(200).json({
      success: true,
      positions,
    });
  } catch (err) {
    console.error("Error in user registration:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getPositions };
