const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ABZREST",
  password: "1903",
  port: 5432, // Default PostgreSQL port
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
    } else {
      console.log("Positions table created successfully");
    }
  }
);

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
      console.error("Error creating table:", err);
    } else {
      console.log("Table created successfully");
    }
    pool.end(); // Close the connection pool
  }
);
