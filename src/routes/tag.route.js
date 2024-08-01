"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const tagController = require("../controllers/tag.controller");
const { createTagSchema } = require("../schemas/tag.schema");
const {
    validateData,
    validateExtFile,
    validateFileNotFound,
    validateFieldsInFile,
} = require("../middleware/validate.middleware");
const { uploadDisk } = require("../configs/multer.config");
const { authentication } = require("../middleware/auth.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { UPDATE_ANY, CREATE_ANY, DELETE_ANY } = require("../constants/rbac.constant");

route.get(`/`, asyncHandler(tagController.find));
route.get("/:tagId", asyncHandler(tagController.findById));

route.use(authentication);

// for teacher role

route.post(
    `/multiple`,
    [
        grantAccess(CREATE_ANY, "tag"),
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["xlsx", "csv"],
            message: "File upload chỉ cho phép có đuôi .xlsx, .csv!",
        }),
        validateFieldsInFile({ fields: ["tagName"], keyBody: "tags" }),
    ],
    asyncHandler(tagController.createMultipleWithUploadFile)
);
route.post(
    `/`,
    grantAccess(CREATE_ANY, "tag"),
    validateData(createTagSchema),
    asyncHandler(tagController.create)
);
route.patch(
    `/:tagId`,
    grantAccess(UPDATE_ANY, "tag"),
    validateData(createTagSchema),
    asyncHandler(tagController.update)
);
route.delete(`/:tagId`, grantAccess(DELETE_ANY, "tag"), asyncHandler(tagController.deleteById));

module.exports = route;
