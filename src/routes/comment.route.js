"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const commentController = require("../controllers/comment.controller");
const {
    createCommentSchema,
    updateCommentSchema,
    deleteCommentSchema,
} = require("../schemas/comment.schema");
const { validateData } = require("../middleware/validate.middleware");

const { authentication } = require("../middleware/auth.middleware");

route.use(authentication);

route.post("/", validateData(createCommentSchema), asyncHandler(commentController.createComment));
route.patch(
    "/:commentId",
    validateData(updateCommentSchema),
    asyncHandler(commentController.updateComment)
);
route.get("/", asyncHandler(commentController.getCommentsByParentId));
route.delete("/", validateData(deleteCommentSchema), asyncHandler(commentController.deleteComment));

module.exports = route;
