"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const authController = require("../controllers/auth.controller");

route.post(`/register`, asyncHandler(authController.register));

module.exports = route;
