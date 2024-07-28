"use strict";

const express = require("express");
const APP_CONFIGS = require("../configs/app.config");
const route = express.Router();

route.use(`${APP_CONFIGS.PREFIX}/auth`, require("./auth.route"));
route.use(`${APP_CONFIGS.PREFIX}/user`, require("./user.route"));
route.use(`${APP_CONFIGS.PREFIX}/tag`, require("./tag.route"));
route.use(`${APP_CONFIGS.PREFIX}/part`, require("./part.route"));
route.use(`${APP_CONFIGS.PREFIX}/questionType`, require("./questionType.route"));
route.use(`${APP_CONFIGS.PREFIX}/test`, require("./test.route"));
route.use(`${APP_CONFIGS.PREFIX}/upload`, require("./upload.route"));
route.use(`${APP_CONFIGS.PREFIX}/question`, require("./question.route"));
route.use(`${APP_CONFIGS.PREFIX}/test-part`, require("./testPart.route"));
route.use(`${APP_CONFIGS.PREFIX}/exam`, require("./exam.route"));
route.use(`${APP_CONFIGS.PREFIX}/score`, require("./score.route"));
route.use(`${APP_CONFIGS.PREFIX}/score-details`, require("./scoreDetails.route"));
route.use(`${APP_CONFIGS.PREFIX}/document`, require("./document.route"));

module.exports = route;
