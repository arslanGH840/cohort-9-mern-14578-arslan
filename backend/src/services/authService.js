const userRepository = require("../repositories/userRepository");
const passwordUtil = require("../utils/password");
const jwtUtil = require("../utils/jwt");
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
  try {
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new ConflictError(
        "An account with this username or email already exists",
      );
    }

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictError(
        "An account with this username or email already exists",
      );
    }

    const password_hash = await passwordUtil.hashPassword(password);
    const user = await userRepository.createUser({
      username,
      email,
      password_hash,
    });

    logger.info({ username: user.username }, "User registered successfully");
    return user;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new ConflictError(
        "An account with this username or email already exists",
      );
    }
    if (error instanceof ConflictError) {
      throw error;
    }
    logger.error({ err: error }, "Registration failed unexpectedly");
    throw error;
  }
};

const login = async ({ username, password }) => {
  try {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      logger.warn({ username }, "Login failed: unknown username");
      throw new AuthenticationError("Invalid username or password");
    }

    const isPasswordValid = await passwordUtil.comparePassword(
      password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      logger.warn({ username }, "Login failed: incorrect password");
      throw new AuthenticationError("Invalid username or password");
    }

    const token = jwtUtil.signToken({ id: user.id, username: user.username });
    logger.info({ username: user.username }, "User logged in successfully");

    return { user, token };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    logger.error(
      { err: error, userId: undefined },
      "Login failed unexpectedly",
    );
    throw error;
  }
};

module.exports = { register, login, ConflictError, AuthenticationError };
