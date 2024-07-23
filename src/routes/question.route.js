"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const questionController = require("../controllers/question.controller");

route.get(`/test/:testId`, asyncHandler(questionController.getByTestId));
route.get(`/:testId/:partId`, asyncHandler(questionController.getByTestPartId));
route.get(
    `/test/:testId/question-type/:questionTypeId`,
    asyncHandler(questionController.getByTestQuestionTypeId)
);

module.exports = route;
