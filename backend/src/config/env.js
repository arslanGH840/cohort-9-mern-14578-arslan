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
  db: {
    host: process.env.DB_HOST || "localhost",
    name: process.env.DB_NAME || "notes_app_dev",
    user: process.env.DB_USER || "notes_app_user",
    password: process.env.DB_PASSWORD || "",
  },
};

module.exports = env;
