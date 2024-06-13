"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const userController = require("../controllers/user.controller");

route.get(`/`, asyncHandler(userController.find));

module.exports = route;
