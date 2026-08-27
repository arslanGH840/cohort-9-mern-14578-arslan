const { sequelize } = require("../../src/database");

const cleanDatabase = async () => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { transaction });
    await sequelize.query("TRUNCATE TABLE notes", { transaction });
    await sequelize.query("TRUNCATE TABLE users", { transaction });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { cleanDatabase };
