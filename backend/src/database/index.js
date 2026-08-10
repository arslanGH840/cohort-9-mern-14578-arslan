const { Sequelize } = require("sequelize");
const env = require("../config/env");
const logger = require("../config/logger");

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  dialect: "mysql",
  logging: false,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");
  } catch (error) {
    logger.error({ err: error }, "Unable to connect to the database");
    throw error;
  }
};

module.exports = { sequelize, connectToDatabase };
