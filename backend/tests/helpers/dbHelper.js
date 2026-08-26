const { sequelize } = require("../../src/database");

const cleanDatabase = async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await sequelize.query("TRUNCATE TABLE notes");
  await sequelize.query("TRUNCATE TABLE users");
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
};

module.exports = { cleanDatabase };
