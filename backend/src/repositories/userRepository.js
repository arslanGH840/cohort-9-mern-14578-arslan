const { User } = require("../models");

const findByUsername = async (username) => {
  return User.findOne({ where: { username } });
};

const findByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const findById = async (id) => {
  return User.findByPk(id);
};

const createUser = async ({ username, email, password_hash }) => {
  return User.create({ username, email, password_hash });
};

module.exports = { findByUsername, findByEmail, findById, createUser };
