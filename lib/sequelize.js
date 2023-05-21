"use strict";

const Sequelize = require("sequelize");
const {
  NODE_ENV,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
} = require("../utils/config.js");
const logger = require("../utils/logger.js");

let sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    dialect: "postgres",
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    logging: logger.log,
  }
);

sequelize
  .authenticate()
  .then(() =>
    logger(
      "info",
      `
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          Database connection has been established successfully
                   Node environment: ${NODE_ENV}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  `
    )
  )
  .catch((err) => console.log("Unable to connect to the database: " + err));

module.exports = sequelize;
