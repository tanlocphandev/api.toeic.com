"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const documentController = require("../controllers/document.controller");
const { createDocSchema } = require("../schemas/document.schema");
const { validateData } = require("../middleware/validate.middleware");
const { CREATE_ANY, UPDATE_ANY, DELETE_ANY } = require("../constants/rbac.constant");
const grantAccess = require("../middleware/rbac.middleware");
const { authentication } = require("../middleware/auth.middleware");

route.get(`/`, asyncHandler(documentController.find));
route.get("/:docId", asyncHandler(documentController.findById));

route.use(authentication);

// For teacher role
route.post(
    `/`,
    grantAccess(CREATE_ANY, "document"),
    validateData(createDocSchema),
    asyncHandler(documentController.create)
);

route.patch(
    `/:docId`,
    grantAccess(UPDATE_ANY, "document"),
    asyncHandler(documentController.update)
);

route.delete(
    `/:docId`,
    grantAccess(DELETE_ANY, "document"),
    asyncHandler(documentController.delete)
);

module.exports = route;
