"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const userController = require("../controllers/user.controller");
const { authentication, checkRoles } = require("../middleware/auth.middleware");
const { USER_ROLES } = require("../constants");

route.use(authentication);
route.use(checkRoles([USER_ROLES.ADMIN]));

route.get(`/`, asyncHandler(userController.find));

module.exports = route;
