const db = require("../../db/index");

class PositionModel {
  async getPositions() {
    try {
      const result = db.any("SELECT * FROM positions");
      return result;
    } catch (err) {
      console.error(" Error get Positions");
      throw err;
    }
  }
}

module.exports = new PositionModel();
