"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const questionController = require("../controllers/question.controller");

route.get(`/test/:testId`, asyncHandler(questionController.getByTestId));

module.exports = route;
