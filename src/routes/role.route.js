"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const scoreController = require("../controllers/score.controller");
const { createScoreSchema } = require("../schemas/score.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication } = require("../middleware/auth.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { CREATE_ANY, UPDATE_ANY } = require("../constants/rbac.constant");
const roleController = require("../controllers/role.controller");

route.use(authentication);

route.get(`/`, asyncHandler(roleController.getRoles));
route.get(`/view/:roleId`, asyncHandler(roleController.viewRolesById));

module.exports = route;
