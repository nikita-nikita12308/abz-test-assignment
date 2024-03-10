const pgp = require("pg-promise");
const connection = {
  user: "postgres",
  password: "1903",
  host: "localhost",
  port: 5432,
  database: "ABZREST",
};

const pg = pgp();
const db = pg(connection);

module.exports = db;
