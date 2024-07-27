"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const scoreDetailsController = require("../controllers/scoreDetails.controller");
const { createScoreSchema } = require("../schemas/score.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication, checkRoles } = require("../middleware/auth.middleware");
const { USER_ROLES } = require("../constants");

route.get(`/`, asyncHandler(scoreDetailsController.find));
route.get("/:scoreId", asyncHandler(scoreDetailsController.findById));

route.use(authentication);
route.use(checkRoles([USER_ROLES.ADMIN]));

route.post(`/`, validateData(createScoreSchema), asyncHandler(scoreDetailsController.create));
route.patch(`/:scoreId`, asyncHandler(scoreDetailsController.update));

module.exports = route;
