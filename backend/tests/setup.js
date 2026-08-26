const path = require("path");
const dotenv = require("dotenv");

process.env.NODE_ENV = "test";

const result = dotenv.config({
  path: path.resolve(__dirname, "../.env.test"),
  override: true,
});

if (result.error) {
  throw new Error(
    "Failed to load .env.test — tests must not run against the default environment. " +
      result.error.message,
  );
}

if (process.env.DB_NAME !== "notes_app_test") {
  throw new Error(
    `Refusing to run tests: DB_NAME is "${process.env.DB_NAME}", expected "notes_app_test". ` +
      "Check .env.test to avoid accidentally wiping a non-test database.",
  );
}
