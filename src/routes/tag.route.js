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

route.post(
    `/multiple`,
    [
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
route.post(`/`, validateData(createTagSchema), asyncHandler(tagController.create));
route.get(`/`, asyncHandler(tagController.find));
route.patch(`/:tagId`, validateData(createTagSchema), asyncHandler(tagController.update));
route.get("/:tagId", asyncHandler(tagController.findById));

module.exports = route;
