"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const scoreController = require("../controllers/score.controller");
const { createScoreSchema } = require("../schemas/score.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication, checkRoles } = require("../middleware/auth.middleware");
const { USER_ROLES } = require("../constants");

route.get(`/`, asyncHandler(scoreController.find));
route.get("/:scoreId", asyncHandler(scoreController.findById));

route.use(authentication);
route.use(checkRoles([USER_ROLES.ADMIN]));

route.post(`/`, validateData(createScoreSchema), asyncHandler(scoreController.create));
route.patch(`/:scoreId`, validateData(createScoreSchema), asyncHandler(scoreController.update));

module.exports = route;
