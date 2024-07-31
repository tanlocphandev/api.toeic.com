"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const rbacController = require("../controllers/rbac.controller");
const { createResourceSchema, createRoleSchema } = require("../schemas/rbac.schema");
const { validateData } = require("../middleware/validate.middleware");

route.post(
    `/resource`,
    validateData(createResourceSchema),
    asyncHandler(rbacController.creteResource)
);

route.post(`/role`, validateData(createRoleSchema), asyncHandler(rbacController.creteRole));

route.get("/resources", asyncHandler(rbacController.getAllResource));
route.get(`/roles`, asyncHandler(rbacController.getListRole));

module.exports = route;
