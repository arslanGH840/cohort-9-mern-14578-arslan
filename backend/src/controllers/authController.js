const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await authService.register({ username, email, password });

    res.status(201).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.login({ username, password });

    res.status(200).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
