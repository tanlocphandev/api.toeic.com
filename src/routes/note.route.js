"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const noteController = require("../controllers/note.controller");
const { createNoteSchema } = require("../schemas/note.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication } = require("../middleware/auth.middleware");
const { READ_OWN, UPDATE_OWN, DELETE_OWN, CREATE_OWN } = require("../constants/rbac.constant");
const grantAccess = require("../middleware/rbac.middleware");

route.use(authentication);

route.get(`/`, grantAccess(READ_OWN, "note"), asyncHandler(noteController.find));
route.get("/:noteId", grantAccess(READ_OWN, "note"), asyncHandler(noteController.findById));
route.post(
    `/`,
    grantAccess(CREATE_OWN, "note"),
    validateData(createNoteSchema),
    asyncHandler(noteController.create)
);
route.patch(`/:noteId`, grantAccess(UPDATE_OWN, "note"), asyncHandler(noteController.update));
route.delete(`/:noteId`, grantAccess(DELETE_OWN, "note"), asyncHandler(noteController.delete));

module.exports = route;
