const db = require("../../db/index");

class UserModel {
  async createUser(name, email, phone, position_id, photo) {
    try {
      const result = await db.one(
        "INSERT INTO users (name, email, phone, position_id, photo, registration_timestamp) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id",
        [name, email, phone, position_id, photo]
      );

      return result.id;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async findUserByEmailOrPhone(email, phone) {
    try {
      const result = await db.any(
        "SELECT * FROM users WHERE email = $1 OR phone = $2",
        [email, phone]
      );
      return result;
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const result = await db.oneOrNone(
        "SELECT u.id, u.name, u.email, u.phone, positions.name AS position, u.position_id, u.photo  FROM users u JOIN positions ON u.position_id = positions.id WHERE u.id = $1",
        [id]
      );
      return result;
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  }

  async getUsersCount() {
    try {
      const result = await db.one("SELECT COUNT(*) FROM users");
      return result.count;
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  }

  async getUsers(limit, offset) {
    try {
      const result = await db.manyOrNone(
        "SELECT u.id, u.name, u.email, u.phone, positions.name AS position, u.position_id, u.registration_timestamp, u.photo FROM users u JOIN positions ON u.position_id = positions.id ORDER BY registration_timestamp DESC LIMIT $1 OFFSET $2",
        [limit, offset]
      );
      return result;
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  }
}

module.exports = new UserModel();
