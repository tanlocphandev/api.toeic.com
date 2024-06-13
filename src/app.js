require("dotenv/config");
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializeDB } = require("./db/mysql.db");
const { catchNotFound, catchError } = require("./middleware/error.middleware");

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeDB();

app.use(require("./routes"));

app.use(catchNotFound);
app.use(catchError);

module.exports = app;
