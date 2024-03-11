const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { POSTGRES_URL } = process.env;

const pool = new Pool({
  connectionString: POSTGRES_URL,
});

// Create positions table
pool.query(
  `
  CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  );
`,
  (err, result) => {
    if (err) {
      console.error("Error creating positions table:", err);
      pool.end(); // Close the connection pool in case of an error
    } else {
      console.log("Positions table created successfully");

      // Create users table after positions table is created
      pool.query(
        `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(60) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(15) NOT NULL,
          position_id INTEGER REFERENCES positions(id),
          photo VARCHAR(255) NOT NULL,
          registration_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
        (err, result) => {
          if (err) {
            console.error("Error creating users table:", err);
          } else {
            console.log("Users table created successfully");
          }
          pool.end(); // Close the connection pool
        }
      );
    }
  }
);
