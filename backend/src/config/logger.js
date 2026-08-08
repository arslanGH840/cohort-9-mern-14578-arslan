const pino = require("pino");
const env = require("./env");

const logger = pino({
  level: env.nodeEnv === "production" ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      'res.headers["set-cookie"]',
    ],
    censor: "[Redacted]",
  },
});

module.exports = logger;
