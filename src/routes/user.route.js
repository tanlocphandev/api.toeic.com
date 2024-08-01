"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const userController = require("../controllers/user.controller");
const { authentication } = require("../middleware/auth.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { READ_ANY, CREATE_OWN, UPDATE_OWN } = require("../constants/rbac.constant");
const { addTeacherSchema, updateProfileSchema } = require("../schemas/user.schema");
const { validateData } = require("../middleware/validate.middleware");

route.use(authentication);

// for admin role

route.get(`/`, grantAccess(READ_ANY, "user"), asyncHandler(userController.find));

route.post(
    `/teacher`,
    [grantAccess(CREATE_OWN, "user"), validateData(addTeacherSchema)],
    asyncHandler(userController.addTeacher)
);

route.patch(
    `/`,
    [grantAccess(UPDATE_OWN, "user"), validateData(updateProfileSchema)],
    asyncHandler(userController.updateProfile)
);

module.exports = route;
