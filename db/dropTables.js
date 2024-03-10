const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ABZREST",
  password: "1903",
  port: 5432, // Default PostgreSQL port
});

// Drop users table
pool.query(
  `
  DROP TABLE IF EXISTS users;
`,
  (err, result) => {
    if (err) {
      console.error("Error dropping users table:", err);
    } else {
      console.log("Users table dropped successfully");
    }
  }
);

// Drop positions table
pool.query(
  `
  DROP TABLE IF EXISTS positions;
`,
  (err, result) => {
    if (err) {
      console.error("Error dropping positions table:", err);
    } else {
      console.log("Positions table dropped successfully");
    }
    pool.end(); // Close the connection pool
  }
);
