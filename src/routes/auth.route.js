"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const authController = require("../controllers/auth.controller");
const { validateData } = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");
const { authentication } = require("../middleware/auth.middleware");

route.post(`/register`, validateData(registerSchema), asyncHandler(authController.register));
route.post(`/login`, validateData(loginSchema), asyncHandler(authController.login));

route.use(authentication);

route.post(`/refresh`, asyncHandler(authController.refresh));
route.post(`/logout`, asyncHandler(authController.logout));
route.get(`/me`, asyncHandler(authController.getMe));

module.exports = route;
