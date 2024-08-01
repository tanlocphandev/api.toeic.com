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

route.get(`/`, asyncHandler(scoreController.find));
route.get("/:scoreId", asyncHandler(scoreController.findById));

route.use(authentication);
// For teacher role

route.post(
    `/`,
    grantAccess(CREATE_ANY, "score"),
    validateData(createScoreSchema),
    asyncHandler(scoreController.create)
);
route.patch(`/:scoreId`, grantAccess(UPDATE_ANY, "score"), asyncHandler(scoreController.update));

module.exports = route;
