"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const noteController = require("../controllers/note.controller");
const { createNoteSchema } = require("../schemas/note.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication } = require("../middleware/auth.middleware");

route.use(authentication);

route.get(`/`, asyncHandler(noteController.find));
route.get("/:noteId", asyncHandler(noteController.findById));
route.post(`/`, validateData(createNoteSchema), asyncHandler(noteController.create));
route.patch(`/:noteId`, asyncHandler(noteController.update));
route.delete(`/:noteId`, asyncHandler(noteController.delete));

module.exports = route;
