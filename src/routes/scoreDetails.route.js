"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const scoreDetailsController = require("../controllers/scoreDetails.controller");
const { createScoreSchema } = require("../schemas/score.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication } = require("../middleware/auth.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { CREATE_ANY, UPDATE_ANY } = require("../constants/rbac.constant");

route.get(`/`, asyncHandler(scoreDetailsController.find));
route.get("/:scoreId", asyncHandler(scoreDetailsController.findById));

route.use(authentication);
// for teacher role

route.post(
    `/`,
    [grantAccess(CREATE_ANY, "score-details"), validateData(createScoreSchema)],
    asyncHandler(scoreDetailsController.create)
);
route.patch(
    `/:scoreId`,
    grantAccess(UPDATE_ANY, "score-details"),
    asyncHandler(scoreDetailsController.update)
);

module.exports = route;
