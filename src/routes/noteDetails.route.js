"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const noteDetailsController = require("../controllers/noteDetails.controller");
const { createNoteDetailsSchema } = require("../schemas/noteDetails.schema");
const { validateData } = require("../middleware/validate.middleware");
const { authentication } = require("../middleware/auth.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { READ_OWN, CREATE_OWN, UPDATE_OWN, DELETE_OWN } = require("../constants/rbac.constant");

route.use(authentication);

route.get(`/`, grantAccess(READ_OWN, "note-details"), asyncHandler(noteDetailsController.find));
route.get(
    "/:noteDetailsId",
    grantAccess(READ_OWN, "note-details"),
    asyncHandler(noteDetailsController.findById)
);
route.post(
    `/`,
    grantAccess(CREATE_OWN, "note-details"),
    validateData(createNoteDetailsSchema),
    asyncHandler(noteDetailsController.create)
);
route.patch(
    `/:noteDetailsId`,
    grantAccess(UPDATE_OWN, "note-details"),
    asyncHandler(noteDetailsController.update)
);
route.delete(
    `/:noteDetailsId`,
    grantAccess(DELETE_OWN, "note-details"),
    asyncHandler(noteDetailsController.delete)
);

module.exports = route;
