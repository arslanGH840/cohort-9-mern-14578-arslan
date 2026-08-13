const {
  findByUsername,
  findByEmail,
  createUser,
} = require("../repositories/userRepository");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { UniqueConstraintError } = require("sequelize");

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
    throw new AuthenticationError("Invalid username or password");
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid username or password");
  }

  const token = signToken({ id: user.id, username: user.username });

  return { user, token };
};

module.exports = { register, login, ConflictError, AuthenticationError };
