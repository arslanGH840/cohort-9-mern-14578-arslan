const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Authentication required",
      },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Invalid or expired token",
      },
    });
  }
};

module.exports = authMiddleware;
