const app = require("./app");
const env = require("./config/env");
const { connectToDatabase } = require("./database");

const startServer = async () => {
  await connectToDatabase();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

startServer();
