const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const pinoHttp = require("pino-http");
const env = require("./config/env");
const logger = require("./config/logger");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendOrigin }));
app.use(pinoHttp({ logger }));
app.use(express.json());

app.use("/", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
