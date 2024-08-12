require("dotenv/config");
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializeDB } = require("./db/mysql.db");
const { catchNotFound, catchError } = require("./middleware/error.middleware");
const corsConfig = require("./configs/cors.config");
const compression = require("compression");
const { logBody } = require("./middleware/logBody.middleware");

// init;

app.use(cors(corsConfig));
app.use(compression());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

initializeDB();

app.use(logBody);
app.use(require("./routes"));

app.use(catchNotFound);
app.use(catchError);

module.exports = app;
