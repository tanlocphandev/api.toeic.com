"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const questionController = require("../controllers/question.controller");
const { authentication } = require("../middleware/auth.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { UPDATE_OWN } = require("../constants/rbac.constant");

route.get(`/`, asyncHandler(questionController.find));
route.get(`/test/:testId`, asyncHandler(questionController.getByTestId));
route.get(`/:testId/:partId`, asyncHandler(questionController.getByTestPartId));
route.get(
    `/test/:testId/question-type/:questionTypeId`,
    asyncHandler(questionController.getByTestQuestionTypeId)
);

route.use(authentication);

route.patch(
    `/:questionId`,
    grantAccess(UPDATE_OWN, "question"),
    asyncHandler(questionController.updateQuestion)
);

module.exports = route;
