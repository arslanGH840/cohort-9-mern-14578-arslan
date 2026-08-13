const {
  findByUsername,
  findByEmail,
  createUser,
} = require("../repositories/userRepository");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { UniqueConstraintError } = require("sequelize");
const logger = require("../config/logger");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

const register = async ({ username, email, password }) => {
  const existingUsername = await findByUsername(username);
  if (existingUsername) {
    throw new ConflictError(
      "An account with this username or email already exists",
    );
  }

  const existingEmail = await findByEmail(email);
  if (existingEmail) {
    throw new ConflictError(
      "An account with this username or email already exists",
    );
  }

  const password_hash = await hashPassword(password);

  try {
    const user = await createUser({ username, email, password_hash });
    logger.info({ username: user.username }, "User registered successfully");
    return user;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new ConflictError(
        "An account with this username or email already exists",
      );
    }
    throw error;
  }
};

const login = async ({ username, password }) => {
  const user = await findByUsername(username);
  if (!user) {
    logger.warn({ username }, "Login failed: unknown username");
    throw new AuthenticationError("Invalid username or password");
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    logger.warn({ username }, "Login failed: incorrect password");
    throw new AuthenticationError("Invalid username or password");
  }

  const token = signToken({ id: user.id, username: user.username });
  logger.info({ username: user.username }, "User logged in successfully");

  return { user, token };
};

module.exports = { register, login, ConflictError, AuthenticationError };
