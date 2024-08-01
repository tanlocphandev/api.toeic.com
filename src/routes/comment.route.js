"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const commentController = require("../controllers/comment.controller");
const {
    createCommentSchema,
    updateCommentSchema,
    deleteCommentSchema,
    updateStatusCommentSchema,
} = require("../schemas/comment.schema");
const { validateData } = require("../middleware/validate.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { authentication } = require("../middleware/auth.middleware");
const {
    CREATE_ANY,
    READ_ANY,
    UPDATE_OWN,
    DELETE_OWN,
    UPDATE_ANY,
} = require("../constants/rbac.constant");

route.use(authentication);

route.post(
    "/",
    grantAccess(CREATE_ANY, "comment"),
    validateData(createCommentSchema),
    asyncHandler(commentController.createComment)
);

route.patch(
    "/:commentId",
    grantAccess(UPDATE_OWN, "comment"),
    validateData(updateCommentSchema),
    asyncHandler(commentController.updateComment)
);

route.patch(
    "/status/:commentId",
    grantAccess(UPDATE_ANY, "comment"), // For admin
    validateData(updateStatusCommentSchema),
    asyncHandler(commentController.updateStatusComment)
);

route.get(
    "/",
    grantAccess(READ_ANY, "comment"),
    asyncHandler(commentController.getCommentsByParentId)
);

route.delete(
    "/",
    grantAccess(DELETE_OWN, "comment"),
    validateData(deleteCommentSchema),
    asyncHandler(commentController.deleteComment)
);

module.exports = route;
