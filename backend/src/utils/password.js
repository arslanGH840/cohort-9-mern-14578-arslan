const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const hashPassword = async (plainTextPassword) => {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
};

const comparePassword = async (plainTextPassword, passwordHash) => {
  return bcrypt.compare(plainTextPassword, passwordHash);
};

module.exports = { hashPassword, comparePassword };
