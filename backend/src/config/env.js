require("dotenv").config();

const parsePort = (value, fallback) => {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    return fallback;
  }
  return parsed;
};

const env = {
  port: parsePort(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || "production",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
};

module.exports = env;
