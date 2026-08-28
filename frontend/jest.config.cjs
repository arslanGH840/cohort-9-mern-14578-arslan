module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/"],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 60,
      functions: 60,
      lines: 75,
    },
  },
  coverageReporters: ["lcov", "text"],
};
