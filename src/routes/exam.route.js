"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const examController = require("../controllers/exam.controller");
const { examSchemaCreate } = require("../schemas/exam.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication, checkRoles } = require("../middleware/auth.middleware");
const { USER_ROLES } = require("../constants");

route.use(authentication);
route.use(checkRoles([USER_ROLES.ADMIN]));

route.post(`/`, validateData(examSchemaCreate), asyncHandler(examController.create));
route.get(`/:examId`, asyncHandler(examController.getById));

module.exports = route;
