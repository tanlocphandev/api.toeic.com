"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const authController = require("../controllers/auth.controller");
const validateData = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");

route.post(`/register`, validateData(registerSchema), asyncHandler(authController.register));
route.post(`/login`, validateData(loginSchema), asyncHandler(authController.login));

module.exports = route;
