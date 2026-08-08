const env = require("../config/env");

const errorHandler = (err, req, res, next) => {
  req.log?.error({ err }, "Unhandled error");

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode === 500 ? "Something went wrong" : err.message,
      ...(env.nodeEnv === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
