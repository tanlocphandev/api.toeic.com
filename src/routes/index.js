"use strict";

const express = require("express");
const APP_CONFIGS = require("../configs/app.config");
const route = express.Router();

route.use(`${APP_CONFIGS.PREFIX}/auth`, require("./auth.route"));
route.use(`${APP_CONFIGS.PREFIX}/user`, require("./user.route"));
route.use(`${APP_CONFIGS.PREFIX}/tag`, require("./tag.route"));
route.use(`${APP_CONFIGS.PREFIX}/upload`, require("./upload.route"));

module.exports = route;
