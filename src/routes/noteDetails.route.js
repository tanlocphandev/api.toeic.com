"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const noteDetailsController = require("../controllers/noteDetails.controller");
const { createNoteDetailsSchema } = require("../schemas/noteDetails.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication } = require("../middleware/auth.middleware");

route.use(authentication);

route.get(`/`, asyncHandler(noteDetailsController.find));
route.get("/:noteDetailsId", asyncHandler(noteDetailsController.findById));
route.post(`/`, validateData(createNoteDetailsSchema), asyncHandler(noteDetailsController.create));
route.patch(`/:noteDetailsId`, asyncHandler(noteDetailsController.update));
route.delete(`/:noteDetailsId`, asyncHandler(noteDetailsController.delete));

module.exports = route;
