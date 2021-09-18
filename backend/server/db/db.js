const { Pool } = require("pg");
const config = require("../common/config");

const pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
});

module.exports = {
  pool,
};
