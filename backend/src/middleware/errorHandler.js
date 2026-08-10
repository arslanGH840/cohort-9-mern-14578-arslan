const env = require("../config/env");

const normalizeStatusCode = (code) => {
  const parsed = Number(code);
  if (Number.isInteger(parsed) && parsed >= 400 && parsed <= 599) {
    return parsed;
  }
  return 500;
};

const errorHandler = (err, req, res, next) => {
  req.log?.error({ err }, "Unhandled error");

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = normalizeStatusCode(err.statusCode);

  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode === 500 ? "Something went wrong" : err.message,
      ...(env.nodeEnv === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
