"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const examController = require("../controllers/exam.controller");
const { examSchemaCreate } = require("../schemas/exam.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication } = require("../middleware/auth.middleware");
const { READ_ANY, READ_OWN, CREATE_ANY } = require("../constants/rbac.constant");
const grantAccess = require("../middleware/rbac.middleware");

route.use(authentication);

route.get(`/`, grantAccess(READ_ANY, "exam"), asyncHandler(examController.find));

route.get(
    `/count-full-test`,
    grantAccess(READ_ANY, "exam"),
    asyncHandler(examController.countExamFullTest)
);

route.get(
    `/sum-total-time-exam`,
    grantAccess(READ_ANY, "exam"),
    asyncHandler(examController.sumTotalTimeExam)
);

route.get(
    `/max-question-correct`,
    grantAccess(READ_ANY, "exam"),
    asyncHandler(examController.getMaxQuestionCorrectByUserId)
);

route.get(
    `/statistic-by-date`,
    grantAccess(READ_ANY, "exam"),
    asyncHandler(examController.statisticByDate)
);

route.get(`/:examId`, grantAccess(READ_OWN, "exam"), asyncHandler(examController.getById));

route.post(
    `/`,
    grantAccess(CREATE_ANY, "exam"),
    validateData(examSchemaCreate),
    asyncHandler(examController.create)
);

module.exports = route;
