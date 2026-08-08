const authMiddleware = (req, res, next) => {
  // TODO (Epic 4): verify JWT from Authorization header, attach req.user
  return res.status(501).json({
    success: false,
    error: {
      message: "Authentication not yet implemented",
    },
  });
};

module.exports = authMiddleware;
