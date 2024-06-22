"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const tagController = require("../controllers/tag.controller");
const { createTagSchema } = require("../schemas/tag.schema");
const validateData = require("../middleware/validate.middleware");

route.post(`/`, validateData(createTagSchema), asyncHandler(tagController.create));
route.get(`/`, asyncHandler(tagController.find));
route.patch(`/:tagId`, validateData(createTagSchema), asyncHandler(tagController.update));
route.get("/:tagId", asyncHandler(tagController.findById));

module.exports = route;
