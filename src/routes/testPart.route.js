"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const testPartController = require("../controllers/testPart.controller");
const { authentication } = require("../middleware/auth.middleware");

route.use(authentication);

route.get(`/part/:partId`, asyncHandler(testPartController.getByPartId));
route.get(`/:testId/:partId`, asyncHandler(testPartController.getById));

module.exports = route;
