"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const examController = require("../controllers/exam.controller");
const { examSchemaCreate } = require("../schemas/exam.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication } = require("../middleware/auth.middleware");

route.use(authentication);

route.get(`/`, asyncHandler(examController.find));
route.get(`/:examId`, asyncHandler(examController.getById));
route.post(`/`, validateData(examSchemaCreate), asyncHandler(examController.create));

module.exports = route;
