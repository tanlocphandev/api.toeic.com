"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const documentController = require("../controllers/document.controller");
const { createDocSchema } = require("../schemas/document.schema");
const { validateData } = require("../middleware/validate.middleware");

route.get(`/`, asyncHandler(documentController.find));
route.post(`/`, validateData(createDocSchema), asyncHandler(documentController.create));
route.get("/:docId", asyncHandler(documentController.findById));
route.patch(`/:docId`, asyncHandler(documentController.update));
route.delete(`/:docId`, asyncHandler(documentController.delete));

module.exports = route;
