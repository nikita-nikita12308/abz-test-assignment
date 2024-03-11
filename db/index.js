const pgp = require("pg-promise");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { POSTGRES_URL } = process.env;

const connection = {
  connectionString: POSTGRES_URL,
};

const pg = pgp();
const db = pg(connection);

module.exports = db;
